package com.example.projectmanagement.control;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.example.projectmanagement.entity.User;
import com.example.projectmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
public class LoginController {
    @Autowired
    private UserService userService;

    @GetMapping("/")
    public String toLogin() {
        return "login";
    }

    @GetMapping("/login")
    public String login(User user, Model model) {
        User one = userService.getOne(Wrappers.<User>lambdaQuery()
                .eq(User::getEmail, user.getEmail())
                .eq(User::getPwd, user.getPwd()));
        model.addAttribute("user", one);
        if (one != null) {
            return "IDE_main";
        } else {
            return "redirect:/";
        }
    }

    @GetMapping("/toRegister")
    public String toRegister() {
        return "register";
    }


    @PostMapping("/register")
    @ResponseBody
    public Map<String, String> register(User user) {
        Map<String, String> resutl = new HashMap<>();
        resutl.put("msg", "");
        resutl.put("code", "200");
        try {
            userService.save(user);
        } catch (Exception e) {
            e.printStackTrace();
            resutl.put("msg", "注册失败，该邮箱或者用户名已存在！");
            resutl.put("code", "400");
        }
        return resutl;
    }
}
