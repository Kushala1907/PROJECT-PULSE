# PROJECT-PULSE
## Description
This product will serve as tracking tool for projects and portfolio for each GDO and overall organisation. 


## Installation

You can clone the github project in your local repository for further implementation using the below command:
git clone https://github.com/Kushala1907/PROJECT-PULSE

You can also download the zip file of this project and extract the files.

If you download manually, you can use the below command to install all modules that are used in this project

  npm install

After the installation of modules, you can start the server using the below command:

  npm start
  
Create a database for this project and create employees table in that database with attributes email of string type, name of string type, role of string type.
only wal employees can register and can be added to employee table.

after assigning role by super admin to emplyee if emplyee role is one of (admin user,super admin,hr manager,gdo,project manager) he/she added to user table which contains fields as email,name,role.

Create .env file and add the following details to your .env file

PORT=assign port

DB_NAME=project

DB_USER=root

SECRET_KEY=assign some key

DB_PASSWORD=password

EMAIL_USER=add user

EMAIL_PASS=password

## Overview
### Roles in the project

1.SuperAdmin

2.Admin

3.GDO(Global Delivery Organization)

4.Project Manager

5.HR Manager


### Tasks performed by various Roles

#### Super Admin

 1.Get all the employees and users(special roles)
 
 2.Assign roles to the Employees.
 
#### Admin

 1.Get all the projects in an organization
 
 2.Get details of a specific project (Detailed overview,project concerns, project updates and team Composition)
 
 3.Create a project
 
 4.Update the existing project
 
 5.Delete existing project
 
 6.Get resourcing requests
 
#### GDO

 1.Get all projects under him
 
 2.Get details of specific project (Detailed overview,project concerns, project updates and team Composition)
 
 3.Add existing employees to project(creating team for a project)
 
 4.Update employee details in a team
 
 5.Delete employee details in a team
 
 6.Raising Resource requests
 
#### Project Manager

 1.Get project details under him
 
 2.updates project-updates 
 
 3.raises project concerns
 
 4.update project updates
 
 5.delete project updates
 
 6.update project concerns
 
 7.delete project concerns 
