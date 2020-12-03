package com.example.projectmanagement.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

@Data
public class User {
    @TableId(type=IdType.AUTO)
    private Integer id      ;// int auto_increment primary key,
    private String username;// varchar(20) null,
    private String nikiname;// varchar(20) null,
    private String email   ;// varchar(20) null,
    private String pwd     ;// varchar(40) null,
}
