package com.hr;

import com.tngtech.archunit.core.domain.JavaClass;
import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchCondition;
import com.tngtech.archunit.lang.ArchRule;
import com.tngtech.archunit.lang.ConditionEvents;
import com.tngtech.archunit.lang.SimpleConditionEvent;

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
