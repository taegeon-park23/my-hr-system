package com.hr.queries.org.service;

import com.hr.queries.org.dto.OrgChartNode;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrgChartQueryServiceTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @InjectMocks
    private OrgChartQueryService orgChartQueryService;

    @Test
    void getOrgChart_shouldConstructTreeCorrectly() {
        // Given
        Long companyId = 1L;
        List<Map<String, Object>> mockRows = new ArrayList<>();
        
        // Root Node
        Map<String, Object> root = new HashMap<>();
        root.put("id", 100L);
        root.put("parent_id", null);
        root.put("name", "CEO App");
        root.put("depth", 0);
        mockRows.add(root);

        // Child Node
        Map<String, Object> child = new HashMap<>();
        child.put("id", 101L);
        child.put("parent_id", 100L);
        child.put("name", "Engineering");
        child.put("depth", 1);
        mockRows.add(child);

        when(jdbcTemplate.queryForList(anyString(), eq(companyId))).thenReturn(mockRows);

        // When
        List<OrgChartNode> result = orgChartQueryService.getOrgChart(companyId);

        // Then
        assertEquals(1, result.size());
        assertEquals("CEO App", result.get(0).getName());
        assertEquals(1, result.get(0).getChildren().size());
        assertEquals("Engineering", result.get(0).getChildren().get(0).getName());
    }
}
