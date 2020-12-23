package com.example.projectmanagement.control;

import com.example.projectmanagement.entity.Project;
import com.example.projectmanagement.entity.User;
import com.example.projectmanagement.service.ProjectService;
import com.example.projectmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class MainController {
    @Autowired
    private UserService userService;

    @Autowired
    private ProjectService projectService;

    @GetMapping("/toProjects/{id}")
    public String toMain(@PathVariable("id") Integer id, Model model) {
        User user = userService.getById(id);
        List<User> list = userService.list();
        List<Project> projects = projectService.list();
        projects.forEach(p -> {
            String usernames = p.getUsernames();
            String xmbq = p.getXmbq();
            if (usernames != null && usernames.trim().length() > 0) {
                p.setUsernames(usernames.replaceAll("-", " "));
            }
        });
        System.out.println(projects);
        model.addAttribute("user", user);
        model.addAttribute("list", list);
        model.addAttribute("projects", projects);
        return "IDE_projects";
    }

    @GetMapping("/toProjectdetail/{id}/{proId}")
    public String toProjectdetail(@PathVariable("id") Integer id, @PathVariable("proId") Integer proId, Model model) {
        User user = userService.getById(id);
        Project pro = projectService.getById(proId);

        pro.setUsernames(pro.getUsernames().replaceAll("-", " "));
        pro.setXmbq(pro.getXmbq().replaceAll("-", " "));

        model.addAttribute("user", user);
        model.addAttribute("pro", pro);
        return "IDE_projectdetail";
    }

    @PostMapping("/saveProject")
    @ResponseBody
    public Map<String, String> saveProject(Project project) {
        System.out.println(project);
        project.setCreateby(userService.getById(project.getUserid()).getUsername());
        project.setCreated(new Date());
        project.setLastupdated(new Date());
        projectService.save(project);
        Map<String, String> resutl = new HashMap<>();
        resutl.put("msg", "");
        resutl.put("code", "200");
        return resutl;
    }

    @GetMapping("/deletepro/{proId}/{id}")
    public String deletepro(@PathVariable("proId") Integer proId, @PathVariable("id") Integer id) {
        projectService.removeById(proId);
        return "redirect:/toProjects/" + id;
    }
}
