package com.example.projectmanagement.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.util.Date;

@Data
public class Project {
    @TableId(type = IdType.AUTO)
    private Integer id;//int auto_increment,
    private Integer status;//int           null,
    private String createby;//varchar(40)   null,
    private String message;//varchar(255)  null,
    private String client;//varchar(64)   null,
    private String version;//varchar(20)   null,
    private Date lastupdated;//datetime      null,
    private Date created;//datetime      null,
    private Integer wcd;//       int           null,
    private String xmbq;//varchar(1024) null,

    @TableField(exist = false)
    private Integer userid;
    private String userids;

    private String usernames;

    private String projectname;
}
