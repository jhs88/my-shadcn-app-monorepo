package com.mmgapts.demo.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mmgapts.demo.model.Item;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
}