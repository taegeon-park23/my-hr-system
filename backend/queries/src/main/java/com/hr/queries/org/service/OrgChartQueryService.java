package com.hr.queries.org.service;

import com.hr.queries.org.dto.OrgChartNode;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class OrgChartQueryService {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public OrgChartQueryService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<OrgChartNode> getOrgChart(Long companyId) {
        // Raw SQL for performance and ignoring JPA entity constraints
        String sql = "SELECT id, parent_id, name, depth FROM departments WHERE company_id = ? ORDER BY depth, id";

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, companyId);
        
        Map<Long, OrgChartNode> nodeMap = rows.stream().collect(Collectors.toMap(
            row -> (Long) row.get("id"),
            row -> new OrgChartNode(
                (Long) row.get("id"),
                (String) row.get("name"),
                (Integer) row.get("depth")
            )
        ));

        List<OrgChartNode> roots = new ArrayList<>();

        for (Map<String, Object> row : rows) {
            Long id = (Long) row.get("id");
            Long parentId = (Long) row.get("parent_id");
            OrgChartNode node = nodeMap.get(id);

            if (parentId == null) {
                roots.add(node);
            } else {
                OrgChartNode parent = nodeMap.get(parentId);
                if (parent != null) {
                    parent.getChildren().add(node);
                }
            }
        }

        return roots;
    }
}
