package com.example.interactivegames.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @RequestMapping("/Home")
    public String home() {
        return "Hello World";
    }


}
