package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.example.demo.model.Item;
import com.example.demo.repo.ItemRepository;

@SpringBootApplication
public class DemoApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Autowired
	ItemRepository itemRepository;

	@Override
	public void run(String... args) throws Exception {
		for (int i = 1; i <= 30; i++) {
			itemRepository.save(new Item(null, "Item " + i));
		}
	}

}
