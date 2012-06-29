/// <reference path="base.js"/>
/// <reference path="/Scripts/Libraries/mustache.js" />
/// <reference path="Libraries/jquery-1.7.2.js" />
/// <reference path="Libraries/jquery.unobtrusive-ajax.js" />
/// <reference path="Libraries/underscore.js" />

if(!root) {
	var root = { };
}
if (!fbi) { var fbi = {}; }

(function(root, fbi, $) {
	"use strict";
	root.util = {
		makeAjaxRequest: function makeAjaxRequest(url, data, requestType) {

			if (!requestType) {
				requestType = "POST";
			}
			$.ajax({
				type: requestType,
				url: url,
				data: data,
				success: function() {
					fbi.bus.emit('dialog.isFinished');
				}
			});
		},
		bustest: function bustest() {
			// Add this to the html to add this test link where ever needed
			// <div><span id="BusTest">Bus Test</span></div>
			console.log("BusTest click event registered.\n Made it all the way through the bus event handlers");
		}
	};

	root.project = {
		subTasks: [],

		create: function createProject() {
			var data = {
				Title: $('#Title').val(),
				Detail: $('#Detail').val(),
				Completed: $('#Completed').is(':checked')
			};
			if (data.Title) {
				fbi.bus.emit("project.action", {
					url: "/Project/Create",
					data: data,
					verb: "POST"
				});

			} else {
				console.log('Title was empty');
			}
		},
		remove: function removeProject() {
			
			var data = {
				ProjectID: $('#ProjectID').val()
			};
			
			fbi.bus.emit('project.action', {
				url: "/Project/Delete",
				data: data,
				verb: "POST"
			});
		},
		edit: function editProject() {
			var data = {
				Title: $('#Title').val(),
				Detail: $('#Detail').val(),
				Completed: $('#Completed').is(':checked'),
				ProjectID: $('#ProjectID').val()
			};

			if (data.Title) {
				fbi.bus.emit('project.action', {
					url: "/Project/Edit",
					data: data,
					verb: "POST"
				});
			} else {
				console.log('Title was empty');
			}
		}
	};

	root.subtask = {
		create: function createSubTask() {
			var data = {
				Title: $('#Title').val(),
				Detail: $('#Detail').val(),
				Completed: $('#Completed').is(':checked'),
				ProjectID: $('#ProjectID').val()
			};
			if (data.Title) {
				fbi.bus.emit("project.action", {
					url: "/SubTask/Create",
					data: data,
					verb: "POST"
				});

			} else {
				console.log('Title was empty');
			}
		},
		remove: function removeSubTask() {
			var data = {
				SubTaskId: $('#SubTaskId').val()
			};
			fbi.bus.emit('project.action', {
				url: "/SubTask/Delete",
				data: data,
				verb: "POST"
			});
		},
		edit: function editSubTask() {
			var data = {
				Title: $('#Title').val(),
				Detail: $('#Detail').val(),
				Completed: $('#Completed').is(':checked'),
				SubTaskId: $('#ProjectID').val()
			};

			if (data.Title) {
				fbi.bus.emit('project.action', {
					url: "/SubTask/Edit",
					data: data,
					verb: "POST"
				});
			} else {
				console.log('Title was empty');
			}
		}
	};
	

}(root, fbi, jQuery));

(function (root, fbi, mustache, $) {
	"use strict";
	var onDocReady = function initializeProjectManager() {
		$(document).ready(function () {
			//Once the dom is ready, load up the bus handlers
			initializeBus();
			//On the first page Load, Get the full projectList.
			//TODO: Refactor to have the project list display handler make this call as it should be responsible for requesting it's own resources
			//TODO because we only want to load all the projects on pages that need it.  Loading that data on every single page is silly
			fbi.bus.emit("project.getAllProjectsOnInitialPageLoad");
		});
	}();
	//initializeProjectManager();
	
	var controller = {
	   init: function init(){
			controller.initializeClickHandlers();
		},
	   initializeClickHandlers: function initializeClickHandlers() {
		
			$( "#ComfirmProjectRemove" ).live( "click", function () { fbi.bus.emit('Project.Remove'); });
	   	    $( "#ComfirmProjectCreate" ).live( "click", function () { fbi.bus.emit('Project.Create'); });
	   		$( "#ComfirmProjectEdit" ).live( "click", function () { fbi.bus.emit('Project.Edit'); });
			$( "#ConfirmSubtaskRemove" ).live( "click", function() { fbi.bus.emit('SubTask.Remove'); });
			$( "#ComfirmSubtaskCreate" ).live( "click", function () { fbi.bus.emit('SubTask.Create'); });
			$( "#ComfirmSubtaskEdit" ).live( "click", function () { fbi.bus.emit('SubTask.Edit'); });
			$( "#BusTest" ).live('click', function () { fbi.bus.emit('Bus.Test'); });
			
			$( "#linkNewProject" ).live( "click", function() {
			var template = $( '#createProject' ).html();
			var data = {
				Title: $('#Title').val(),
				Detail: $('#Detail').val(),
				Completed: $('#Completed').is(':checked')
			};
			var outputHtml = Mustache.to_html(template, data);
			dialogHandler.showMe(outputHtml);
			});
	   	
			$(".editLink").live("click", function() {
				var projectId = $(this).attr("data-id");
				var data = { ProjectID: projectId };
				$.ajax({
						type: "GET",
						url: "/Project/Edit",
						data: data,
						success: function(response) {
							var template = $('#editProject').html();
							var outputHtml = Mustache.to_html(template, response);
							dialogHandler.showMe(outputHtml);
						}
					});
				});
	   	
			$(".deleteLink").live("click", function() {
			var projectId = $(this).attr("data-id");

			var data = {
				ProjectID: projectId
			};
			$.ajax({
					type: "GET",
					url: "/Project/Delete",
					data: data,
					success: function(response) {
					var template = $('#deleteProject').html();
					var outputHtml = Mustache.to_html(template, response);
					dialogHandler.showMe(outputHtml);
				}               
				});

			});
			$('#closeDialog').live("click", function(event) {
				dialogHandler.hideMe(event);
			});			
		},       
	   loadInitialProjectData: function loadInitialProjectData() {
			controller.refreshProjectList();
		},
	   refreshProjectList: function refreshProjectList(e) {
			$.getJSON('/Project/GetProjectsJson', null, function(data) {
				var listTemplate = $('#projectListTemplate').html();
				var outputHtml = Mustache.to_html(listTemplate, data);
				$('#tablerow').html(outputHtml);
			});
		}
		

	}; // END var controller
	var initializeBus = function () {
		// Bus Responders
		// Handle internal events that are not UI events
		
		fbi.bus.once("project.initialize", controller.init());        
		fbi.bus.once("project.getAllProjectsOnInitialPageLoad", controller.loadInitialProjectData);
		fbi.bus.on("project.action", function(options) {
			root.util.makeAjaxRequest(options.url || "", options.data || { }, options.verb || "POST");
		});
		fbi.bus.on("dialog.isFinished", dialogHandler.hideAndRefresh);
		fbi.bus.on("Project.Remove", root.project.remove);
		fbi.bus.on("Project.Create", root.project.create);
		fbi.bus.on("Project.Edit", root.project.edit);
		fbi.bus.on("Subtask.Remove", root.subtask.remove);
		fbi.bus.on("Subtask.Create", root.subtask.create);
		fbi.bus.on("Subtask.Edit", root.subtask.edit);
		fbi.bus.on("Bus.Test", root.util.bustest );
		

		// END Bus Responders

	};
	var dialogHandler = {
		showMe: function showMe(outputHtml) {
			$('.dialog').html(outputHtml);
			$('.dialogOverlay').fadeIn(250, function() {
				$('.dialog').fadeIn(150);
			});
		},
		hideMe: function hideMe(event) {

			//BUG: Does not always get rid of the overlay correctly.  Doesn't select the overlay 
			//NOTE: Currently this is only used when clicking the Close button on the dialog window.    
			var element = $(event.currentTarget);
			var dialog = element.parents('.dialog');
			var overlay = $(".dialogOverlay");

			dialog.fadeOut(250, function() {
				overlay.fadeOut(250, function() {
//                              dialog.delete();
//                              overlay.delete();            
				});
			});

		},
		hideAndRefresh: function hideAndRefresh() {
			$('.dialog').hide();
			$('.dialogOverlay').hide();
			controller.refreshProjectList();
		}        
	};

	if (!root.controllers) {
		root.controllers = { };
	}
	
	root.controllers.main = controller;
}(root, fbi, Mustache, jQuery));