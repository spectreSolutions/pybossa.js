var bind,
  slice = [].slice
// check for missing features
if (typeof bind !== 'function') {
  // adapted from Mozilla Developer Network example at
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
  bind = function bind(obj) {
    var args = slice.call(arguments, 1),
      self = this,
      nop = function() {
      },
      bound = function() {
        return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));
      };
    nop.prototype = this.prototype || {}; // Firefox cries sometimes if prototype is undefined
    bound.prototype = new nop();
    return bound;
  };
  Function.prototype.bind = bind;
}

module("pybossa.newTask(endpoint=/pybossa/) method");
test('should get a new task for the "slug" project from a server endpoint different from root', function() {
        // We use the FakeServer feature to test pybossa.js
        var server = this.sandbox.useFakeServer();

        // Two sample projects are created
        project = [{"info": {"task_presenter": "some HTML and JS" }, "time_limit": null, "description": "Question", "short_name": "slug", "created": "2012-04-02T11:31:24.400338", "owner_id": 1, "calibration_frac": null, "bolt_course_id": null, "time_estimate": null, "hidden": 0, "long_tasks": null, "id": 1, "name": "Application Name"}];

        var tmp = JSON.stringify(project);

        // The endpoint for the FakeServer:
        server.respondWith(
            "GET", "/pybossa/api/project?short_name=slug",
            [200, { "Content-type": "application/json" },
            tmp] 
            );

        // One task for the project:
        var task = [{"info": {"variable": "value"}, "quorum": null, "calibration": 0, "created": "2012-04-02T11:31:24.478663", "project_id": 1, "state": "0", "id": 1, "priority_0": 0.0}];

        var tmp = JSON.stringify(task);

        // The endpoint for the FakeServer:
        server.respondWith(
            "GET", "/pybossa/api/project/1/newtask?offset=0",
            [200, { "Content-type": "application/json" },
            tmp]
            );

        // Test the method newTask( projectname );
        // Set the endpoint
        pybossa.setEndpoint( "/pybossa" );
        pybossa.newTask( "slug" ).done( function( data ) {
                equal( data.question, project[0].description, "The obtained task belongs to the Slug project (id: 1)");
                equal( data.task[0].id, task[0].id, "The TaskRun has been created using the right Task (id: 1)");
                });

        // Trigger the server endpoints
        server.respond();
});


module("pybossa.saveTask(endpoint=/pybossa/) method");

test('should save a task for the "slug" project in a server endpoint different from root', function() {

        var server = this.sandbox.useFakeServer();

        // One task for the project:
        var task = [{"info": {"variable": "value"}, "quorum": null, "calibration": 0, "created": "2012-04-02T11:31:24.478663", "project_id": 1, "state": "0", "id": 1, "priority_0": 0.0}];

        var tmp = JSON.stringify(task[0]);

        // The endpoint for the FakeServer:
        server.respondWith(
            "GET", "/pybossa/api/task/1",
            [200, { "Content-type": "application/json" },
            tmp] 
            );

        var taskrun = [{"info": {"answer": "Value"}, "user_id": 1, "task_id": 1, "created": "2012-04-02T11:51:24.478663", "finish_time": "2012-04-02T11:51:24.478663", "calibration": null, "project_id": 1, "user_ip": null, "timeout": null, "id": 1}];

        var tmp = JSON.stringify(taskrun[0]);

        // The endpoint for the FakeServer:
        server.respondWith(
            "POST", "/pybossa/api/taskrun",
            [200, { "Content-type": "application/json" },
            tmp]
            );

        // Test the method submitTask( taskid, answer );
        taskid = 1;
        ans = taskrun[0].info;

        // Set the endpoint
        pybossa.setEndpoint( "/pybossa" );
        pybossa.saveTask( taskid, ans ).done( function( data ) {
                equal( data.info.answer, taskrun[0].info.answer, "The obtained task belongs to the Slug project (id: 1)");
                });

        server.respond();
});

module("pybossa.userProgress(endpoint=/pybossa/) with PyBossa served from a non-root URL method");
test('should get the userprogress using the "slug" project from the server', function() {
        // We use the FakeServer feature to test pybossa.js
        var server = this.sandbox.useFakeServer();

        project = {'done': 10, 'total': 100};

        var tmp = JSON.stringify(project);

        // The endpoint for the FakeServer:
        server.respondWith(
            "GET", "/pybossa/api/project/slug/userprogress",
            [200, { "Content-type": "application/json" },
            tmp] 
            );

        // Test the method newTask( appname );
        // Set the endpoint
        pybossa.setEndpoint( "/pybossa" );
        pybossa.userProgress( "slug" ).done( function( data ) {
                equal( data.total, 100, "The total number of tasks is correct");
                equal( data.done, 10, "The done number of tasks is correct");
                });

        // Trigger the server endpoints
        server.respond();
});

module("pybossa.run(endpoint=/pybossa/) with PyBossa served from a non-root URL method");
test('should get a new task for the "slug" project from the server', function() {
        // We use the FakeServer feature to test pybossa.js
        var server = this.sandbox.useFakeServer();

        // Two sample projects are created
        project = [{"info": {"task_presenter": "some HTML and JS" }, "time_limit": null, "description": "Question", "short_name": "slug", "created": "2012-04-02T11:31:24.400338", "owner_id": 1, "calibration_frac": null, "bolt_course_id": null, "time_estimate": null, "hidden": 0, "long_tasks": null, "id": 1, "name": "Application Name"}];

        var tmp = JSON.stringify(project);

        // The endpoint for the FakeServer:
        server.respondWith(
            "GET", "/pybossa/api/project?short_name=slug",
            [200, { "Content-type": "application/json" },
            tmp] 
            );

        // One task for the project:
        var task = [{"info": {"variable": "value"}, "quorum": null, "calibration": 0, "created": "2012-04-02T11:31:24.478663", "project_id": 1, "state": "0", "id": 1, "priority_0": 0.0}];

        var tmp = JSON.stringify(task);

        // The endpoint for the FakeServer:
        server.respondWith(
            "GET", "/pybossa/api/project/1/newtask?offset=0",
            [200, { "Content-type": "application/json" },
            tmp]
            );

        // Second task for the project:
        var task2 = [{"info": {"variable": "value2"}, "quorum": null, "calibration": 0, "created": "2012-04-02T11:31:24.478664", "project_id": 1, "state": "0", "id": 2, "priority_0": 0.0}];

        var tmp2 = JSON.stringify(task2);

        // The endpoint for the FakeServer:
        server.respondWith(
            "GET", "/pybossa/api/project/1/newtask?offset=1",
            [200, { "Content-type": "application/json" },
            tmp2]
            );

        // Set the endpoint
        pybossa.setEndpoint( "/pybossa" );

        // Test the method newTask( projectname );
        var answerId = 0;
        pybossa.taskLoaded(function(task, deferred){
                //console.log(answerId);
                console.log("Id of task: " + task[0].id);
                answerId += 1;
                equal( task[0].project_id, 1, "The obtained task belongs to the Slug project (id: 1)");
                equal( task[0].id, answerId, "The TaskRun has been created using the right Task (id: " + answerId + ")");
                deferred.resolve();
        });

        pybossa.presentTask(function(task, deferred){
            // pybossa.saveTask(task.id, answer) <- works
            console.log("Task presented!");
            if (task[0]) {
                deferred.resolve();
            }
        });

        pybossa.run('slug');

        // Trigger the server endpoints
        server.respond();
        expect(4);
});

test('should get the task specified in the url (server/project/projectName/task/3)', function() {
        // We use the FakeServer feature to test pybossa.js
        var server = this.sandbox.useFakeServer();

        // Two sample projects are created
        project = [{"info": {"task_presenter": "some HTML and JS" }, "time_limit": null, "description": "Question", "short_name": "slug", "created": "2012-04-02T11:31:24.400338", "owner_id": 1, "calibration_frac": null, "bolt_course_id": null, "time_estimate": null, "hidden": 0, "long_tasks": null, "id": 1, "name": "Application Name"}];

        var tmp = JSON.stringify(project);

        // The endpoint for the FakeServer:
        server.respondWith(
            "GET", "/pybossa/api/project?short_name=slug",
            [200, { "Content-type": "application/json" },
            tmp] 
            );

        // One task for the project:
        var task = [{"info": {"variable": "value"}, "quorum": null, "calibration": 0, "created": "2012-04-02T11:31:24.478663", "project_id": 1, "state": "0", "id": 1, "priority_0": 0.0}];

        var tmp = JSON.stringify(task);

        // The endpoint for the FakeServer:
        server.respondWith(
            "GET", "/pybossa/api/project/1/newtask?offset=0",
            [200, { "Content-type": "application/json" },
            tmp]
            );

        // Second task for the project:
        var task2 = [{"info": {"variable": "value2"}, "quorum": null, "calibration": 0, "created": "2012-04-02T11:31:24.478664", "project_id": 1, "state": "0", "id": 2, "priority_0": 0.0}];

        var tmp2 = JSON.stringify(task2);

        // The endpoint for the FakeServer:
        server.respondWith(
            "GET", "/pybossa/api/project/1/newtask?offset=1",
            [200, { "Content-type": "application/json" },
            tmp2]
            );

        var requestedTask = [{"info": {"variable": "value2"}, "quorum": null, "calibration": 0, "created": "2012-04-02T11:31:24.478664", "project_id": 1, "state": "0", "id": 3, "priority_0": 0.0}];

        var tmp3 = JSON.stringify(requestedTask);

        // The endpoint for the FakeServer:
        server.respondWith(
            "GET", "/pybossa/api/task/3",
            [200, { "Content-type": "application/json" },
            tmp3]
            );

        // Set the endpoint
        pybossa.setEndpoint( "/pybossa" );

        // Test the method newTask( projectname );
        var answerId = 0;
        pybossa.taskLoaded(function(task, deferred){
                equal( task[0].id, 3, "Wrong task received");
                deferred.resolve();
        });

        pybossa.presentTask(function(task, deferred){
            if (task[0]) {
                deferred.resolve();
            }
        });

        var _window = {location: {pathname: "http://pybossaServer.com/project/1/task/3"},
                       history: {pushState: function(somethig, another, state){
                                                var that = _window;
                                                that.location.pathname = state;}
                                }
                      };

        pybossa.run('slug', _window);

        // Trigger the server endpoints
        server.respond();
        expect(2);
});
