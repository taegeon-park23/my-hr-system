package com.hr;

import com.tngtech.archunit.core.domain.JavaClass;
import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchCondition;
import com.tngtech.archunit.lang.ArchRule;
import com.tngtech.archunit.lang.ConditionEvents;
import com.tngtech.archunit.lang.SimpleConditionEvent;

import static com.tngtech.archunit.library.Architectures.layeredArchitecture;
import static com.tngtech.archunit.library.dependencies.SlicesRuleDefinition.slices;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

@AnalyzeClasses(packages = "com.hr", importOptions = ImportOption.DoNotIncludeTests.class)
public class ArchitectureTest {

    /**
     * 핵심 규칙: 어떤 모듈(com.hr.modules.A)의 클래스는 
     * 다른 모듈(com.hr.modules.B)의 'api' 패키지가 아닌 클래스에 접근해서는 안 된다.
     */
    @ArchTest
    static final ArchRule module_isolation_rule = noClasses()
            .that().resideInAPackage("com.hr.modules..")
            .should(new ArchCondition<JavaClass>("access internal classes of other modules") {
                @Override
                public void check(JavaClass item, ConditionEvents events) {
                    String originPackage = item.getPackageName();
                    String originModule = getModuleName(originPackage);
                    if (originModule == null) return;

                    for (var dependency : item.getDirectDependenciesFromSelf()) {
                        String targetPackage = dependency.getTargetClass().getPackageName();
                        String targetModule = getModuleName(targetPackage);

                        // 다른 모듈이고, target이 'api' 패키지가 아니라면 위반
                        if (targetModule != null && !originModule.equals(targetModule)) {
                            if (!targetPackage.contains(".api")) {
                                String message = String.format(
                                        "Module Violation: %s accesses internal class %s of module %s",
                                        item.getName(),
                                        dependency.getTargetClass().getName(),
                                        targetModule
                                );
                                events.add(SimpleConditionEvent.violated(item, message));
                            }
                        }
                    }
                }
            });

    /**
     * 모듈 간 순환 참조 금지
     */
    @ArchTest
    static final ArchRule no_cycles_between_modules = slices()
            .matching("com.hr.modules.(*)..")
            .should().beFreeOfCycles();

    /**
     * 레이어드 아키텍처 준수 (Controller -> Service -> Repository)
     */
    @ArchTest
    static final ArchRule layered_architecture_rule = layeredArchitecture()
            .consideringAllDependencies()
            .layer("Controller").definedBy("..controller..")
            .layer("Service").definedBy("..service..", "..listener..", "..event..")
            .layer("Repository").definedBy("..repository..")
            .whereLayer("Controller").mayNotBeAccessedByAnyLayer()
            .whereLayer("Service").mayOnlyBeAccessedByLayers("Controller", "Service") 
            .whereLayer("Repository").mayOnlyBeAccessedByLayers("Service");

    /**
     * Command(modules)는 Query(queries)를 참조하지 않아야 함
     */
    @ArchTest
    static final ArchRule modules_should_not_access_queries = noClasses()
            .that().resideInAPackage("com.hr.modules..")
            .should().accessClassesThat().resideInAPackage("com.hr.queries..");

    private static String getModuleName(String packageName) {
        // com.hr.modules.{moduleName}.*
        if (packageName.startsWith("com.hr.modules.")) {
            String[] parts = packageName.split("\\.");
            if (parts.length > 3) {
                return parts[3]; // 'user', 'payroll' etc.
            }
        }
        return null;
    }
}
