# KhichdiJS

####Version : 1.0 *Beta*

###Overview: ###

**Khichdi** is an Indian dish very simple and tasty. **KhichdiJS** is a simple yet powerful JavaScript library, which will help you to have a feature which are provided by most of JavaScript MVC framework. **KhichdiJS** is in beta version now so called as library and not as a framework, because of many features which are provided by such MVC frameworks are not included in this library assuming they just make the simple things complex.  

**KhichdiJS** is right for you only when you want a MVC kind of functionality and want jquery power in hands. There are many things can be improved but I don't wanted to implement things which are already provided by others. I wanted it to be simple and easy. **KhichdiJS** is good for small and medium applications.
##

###Dependencies:
- jQuery
- underscore

 
###Features:
- **Routes** - These are the urls and url patterns of route.
- **Models** - These are urls which will returns a json model. 
- **Views** - These are modules which are called from controllers.
- **Controllers** - These are called as defined in routes.

###How it works:
	
	1. After hitting the url it matches the route.
	2. Calls the defined controller for that route.
	3. Controller loads the model and views are required.
	4. Views are just normal underscore templates which are defined somewhere else.

###App Structure

You can manage the structure as you want but below is the recommended structure.

	App
		-> css
		-> img
		-> js
			-> libs
				-> jquery.js
				-> underscore.js
				-> Khichdi.js

		  	->templates
				->home.html
				->about.html
				->profile.html

			-> app.js
			-> models.js
			-> views.js
			-> controllers.js

		->index.html

###Usage

The example usage many functions in it which are not shown here. Full example can be  found [here](http://emsystem.vivsoftware.in/).

app.js
		
	var app = new KhichdiJS();
	
	//Define Routes
	
	//Default Route - This will call the home controller
	app.DefaultRoute = ['#/home', 'home']; 

	app.Routes = [
	    ['/home', 'home'],
	    ['/about', 'about'],
	    ['/signup', 'signup'],
	    ['/dashboard', 'dashboard'],
	    ['/employees', 'employees'],
	    ['/employees/:id', 'employee'],
		['/login/redirect/:redirecturl', 'login']
	];

	app.configuration.templateExtension = ".html";
	app.start();

models.js
	
	app.Models = {
	    profile: {
	        url: "./api/profile"
	    },
	    employee: {
	        url: "./api/employees/{id}"
	    },
	    employees: {
	        url: "./api/employees"
	    }
	};

views.js
	
	EMSystemApp.Views = {
	    homenavbar: {
	        template: "homenavbar",
	        target: "header",
	        events: function(data) {
				/*
					//after rendering any custom logic
		            removeActiveNavbar();
		            $('#li_' + data).addClass('active'); 
				*/
	        }
	    },
	    home: {
	        template: "home",
	        target: "main-body",
	        otherViews: [{view: "homenavbar", eventData: "home"}]
	    },
	    about: {
	        template: "about",
	        target: "main-body",
	        otherViews: [{view: "homenavbar", eventData: "about"}]
	    },
		signup: {
        	template: "signup",
        	target: "main-body",
        	otherViews: [{view: "homenavbar", eventData: "signup"}],
        	events: function() {
        	    signupActions();
        	}
    	},
	    login: {
	        template: "login",
	        target: "main-body",
	        otherViews: [{view: "homenavbar", eventData: "login"}],
	        events: function() {
	            console.log("EventsSetup");
	            loginActions();
	        }
	    },
	    navbarAdmin: {
	        template: "navbar-admin",
	        target: "navafterlogin",
	        events: function(data) {
	            removeActiveNavbar();
	            $('#li_' + data).addClass('active');
	        }
	    },
	    navbarEmployee: {
	        template: "navbar-employee",
	        target: "navafterlogin",
	        events: function(data) {
	            removeActiveNavbar();
	            $('#li_' + data).addClass('active');
	        }
	    },
	    dashboardnavbar: {
	        template: "dashboardnavbar",
	        target: "header",
	        events: function(data) {
	            getUserType(function() {
	                if (isAdmin) {
	                    EMSystemApp.View('navbarAdmin', null, data);
	                } else {
	                    EMSystemApp.View('navbarEmployee', null, data);
	                }
	            });
	        }
	    },
	    dashboardAdmin: {
	        template: "dashboard-admin",
	        target: "dashboard-content",
	        events: function() {
	            $.ajax({
	                url: './api/employees/count',
	                type: "GET",
	                async: true,
	                success: function(response) {
	                    $("#count").html(response.Count);
	                }
	            });
	        }
	    },
	    dashboardEmployee: {
	        template: "dashboard-employee",
	        target: "dashboard-content",
	        events: function() {
	
	        }
	    },
	    dashboard: {
	        template: "dashboard",
	        target: "main-body",
	        otherViews: [{view: "dashboardnavbar", eventData: "dashboard"}],
	        events: function() {
	            getUserType(function() {
	                if (isAdmin) {
	                    EMSystemApp.View("dashboardAdmin");
	                } else {
	                    EMSystemApp.View("dashboardEmployee");
	                }
	            });
	        }
	    },
	    employees: {
	        template: "employees",
	        target: "main-body",
	        otherViews: [{view: "dashboardnavbar", eventData: "employees"}],
	        events: function() {
	            EMSystemApp.View("employeeDetailsPartial");
	            addEmployee();
	        }
	    },
	    employeeDetailsPartial: {
	        template: "employees-details-partial",
	        target: "employees-details-partial-tbody",
	        model: "employees",
	        events: function() {	            
	            $("#employee_list_tbody").find("tr").on("click", function() {
	                var user_id = $(this).attr("id");
	                redirect("employees/" + user_id);	               
	            });
	        }
	    },	    
	    employee: {
	        template: "employee-details",
	        target: "main-body",
	        model: "employee",
	        otherViews: [{view: "dashboardnavbar", eventData: "employees"}],
	        events: function() {	           
	        }
	    },
	    profile: {
	        template: "profile",
	        target: "main-body",
	        model: "profile",
	        otherViews: [{view: "dashboardnavbar", eventData: "profile"}],
	        events: function() {	            
	        }
	    }
	};

controllers.js
	
	app.Controllers = {
	    home: function() {
	        app.View('home');
	    },
	    about: function() {
	        app.View('about');
	    },
	    signup: function() {
	        function afterLogin(data) {
	            if (data.logged) {
	                userLogged = true;
	                redirect("dashboard");
	            }
	            else {
	                userLogged = false;
	                app.View('signup');
	            }
	        }
	        checkLogin(afterLogin);
	    },
	    login: function(routeVariables) {
	        if (routeVariables !== null) {
	            var redirectURL = routeVariables[0].replace("\\", "/");
	            redirectAfterLogin = redirectURL;
	        }
	        function afterLogin(data) {
	            if (data.logged) {
	                userLogged = true;
	                if (routeVariables !== null) {
	                    redirect(redirectAfterLogin);
	                }
	                else {
	                    redirect("dashboard");
	                }
	            }
	            else {
	                userLogged = false;
	                app.View('login');
	            }
	        }
	        checkLogin(afterLogin);
	    },
	    dashboard: function() {
	        if (userLogged) {
	            app.View('dashboard');
	        } else {
	            redirect("login/redirect/" + getRedirectHash());
	        }
	    },	    
	    profile: function() {
	        if (userLogged) {
	            EMSystemApp.View('profile');
	        } else {
	            redirect("login/redirect/" + getRedirectHash());
	        }
	    },	    
	    employees: function() {
	        if (userLogged) {
	            getUserType(function() {
	                if (isAdmin) {
	                    app.View('employees');
	                } else {
	                    redirect("dashboard");
	                }
	            });
	        }
	        else {
	            redirect("login/redirect/" + getRedirectHash());
	        }
	    },
	    employee: function(routerVariables) {
	        if (userLogged) {
	            getUserType(function() {
	                if (isAdmin) {
	                    var user_id = routerVariables[0];
	                    var modelUrlData = {"id": user_id};
	                    app.View("employee", null, null, modelUrlData);
	                } else {
	                    redirect("dashboard");
	                }
	            });
	        }
	        else {
	            redirect("login/redirect/" + getRedirectHash());
	        }
	    }
	};

License
----
The MIT License (MIT)

Copyright (c) 2014 Vivek Muthal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

Author : Vivek Muthal  
Email : vmuthal.18@gmail.com  
Website : [www.vivsoftware.in](http://www.vivsoftware.in)