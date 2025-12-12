package com.hr.queries.org.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class OrgChartNode {
    private Long id;
    private String name;
    private int depth;
    private List<OrgChartNode> children = new ArrayList<>();

    public OrgChartNode(Long id, String name, int depth) {
        this.id = id;
        this.name = name;
        this.depth = depth;
    }
}
