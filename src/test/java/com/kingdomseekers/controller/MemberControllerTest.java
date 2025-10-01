package com.kingdomseekers.controller;

import com.kingdomseekers.entity.Member;
import com.kingdomseekers.service.MemberService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MemberController.class)
public class MemberControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MemberService memberService;

    private Member testMember;
    private List<Member> memberList;

    @BeforeEach
    void setUp() {
        testMember = new Member();
        testMember.setId(1L);
        testMember.setFirstName("John");
        testMember.setLastName("Doe");
        testMember.setEmail("john.doe@example.com");
        testMember.setPhoneNumber("+1234567890");
        testMember.setVettingStatus(Member.VettingStatus.PENDING);

        Member member2 = new Member();
        member2.setId(2L);
        member2.setFirstName("Jane");
        member2.setLastName("Smith");
        member2.setEmail("jane.smith@example.com");
        member2.setPhoneNumber("+0987654321");
        member2.setVettingStatus(Member.VettingStatus.APPROVED);

        memberList = Arrays.asList(testMember, member2);
    }

    @Test
    @WithMockUser
    void getAllMembers_ShouldReturnAllMembers() throws Exception {
        when(memberService.getAllMembers()).thenReturn(memberList);

        mockMvc.perform(get("/api/members"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].firstName").value("John"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].firstName").value("Jane"));
    }

    @Test
    @WithMockUser
    void getMemberById_WhenMemberExists_ShouldReturnMember() throws Exception {
        when(memberService.getMemberById(1L)).thenReturn(Optional.of(testMember));

        mockMvc.perform(get("/api/members/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstName").value("John"));
    }

    @Test
    @WithMockUser
    void getMemberById_WhenMemberDoesNotExist_ShouldReturnNotFound() throws Exception {
        when(memberService.getMemberById(anyLong())).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/members/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void createMember_ShouldReturnCreatedMember() throws Exception {
        when(memberService.createMember(any(Member.class))).thenReturn(testMember);

        mockMvc.perform(post("/api/members")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john.doe@example.com\",\"phoneNumber\":\"+1234567890\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.firstName").value("John"));
    }

    @Test
    @WithMockUser
    void getMembersByVettingStatus_ShouldReturnFilteredMembers() throws Exception {
        List<Member> pendingMembers = Arrays.asList(testMember);
        when(memberService.getMembersByVettingStatus(Member.VettingStatus.PENDING)).thenReturn(pendingMembers);

        mockMvc.perform(get("/api/members/vetting/PENDING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].vettingStatus").value("PENDING"));
    }

    @Test
    @WithMockUser
    void getMembersByPastor_ShouldReturnFilteredMembers() throws Exception {
        when(memberService.getMembersByPastor(1L)).thenReturn(Arrays.asList(testMember));

        mockMvc.perform(get("/api/members/pastor/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }
}