//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
   struct Project {
       address payable creator;
       uint targetAmount;
       uint deadline;
       uint numFunders;
       uint amountRaised;
   }

   struct Funder {
       address payable addr;
       uint amount;
   }

   Project[] public projects;

   function createProject(uint targetAmount, uint deadline) public {
       Project memory newProject = Project(payable(msg.sender), targetAmount, deadline, 0, 0);
       projects.push(newProject);
   }

   function fundProject(uint projectId) public payable {
       Project storage project = projects[projectId];
       require(block.timestamp < project.deadline, "Project funding period has ended");
       require(msg.value <= project.targetAmount - project.amountRaised, "Project has reached its funding goal");

       project.amountRaised += msg.value;
       project.numFunders++;
   }
}