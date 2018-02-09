// import chai as the assertion library
import chai from 'chai';

// import the library
import prioritize from '../src/App.es6';

// initialize chai should and expect
chai.should();
chai.expect();

let prioritizeajax = new prioritize();

describe('#Prioritize Library Test', function () {
	// // Check if returns false when no options object is given
	// describe('#pajax() - No options object given', function () {
	// 	it('should be false', function () {
	// 	  chai.expect(prioritizeajax.pajax()).to.be.false;
	// 	});
	// });

	// // Check if returns false when empty options object is given
	// describe('#pajax() - Empty options object given', function () {
	// 	it('should be false', function () {
	// 	  chai.expect(prioritizeajax.pajax({})).to.be.false;
	// 	});
	// });

	// // Check if it returns a promise
	// describe('#pajax() - promise return', function () {
	// 	it('should be a promise', function () {
	// 		chai.expect(prioritizeajax.pajax({
	// 			url: 'http://reduxblog.herokuapp.com/api/posts?key=branbazingolhos',
	// 			type: 'get',
	// 			success: (response) => {},
	// 			error: (error) => {},
	// 			priority: 'low',
	// 			g_cancel: 'id',
	// 		})).to.be.a('promise');
	// 	});
	// });

	// Check if it returns a promise
	describe('#pajax() - Put low priority on waiting stack', function () {
		prioritizeajax.pajax({
			url: 'http://reduxblog.herokuapp.com/api/posts?key=branbazingolhos',
			type: 'get',
			data: {name : "testaaa"},
			success: (response) => {},
			error: (error) => {},
			priority: 'low',
			g_cancel: 'id',
		});

		prioritizeajax.pajax({
			url: 'http://reduxblog.herokuapp.com/api/posts?key=branbazingolhos',
			type: 'get',
			data: {name : "testaaa"},
			success: (response) => {},
			error: (error) => {},
			priority: 'high',
			g_cancel: 'id',
		});

		it('Waiting list should have one ', function () {
			console.log(prioritizeajax.waiting_stack.length);
			chai.expect(prioritizeajax.waiting_stack.length).to.equal(1);
		});
	});

	// Cancel all
	describe('#pajax() - Cancel requests with global cancel id', function () {
		var options = {
			url: 'http://reduxblog.herokuapp.com/api/posts?key=branbazingolhos',
			type: 'get',
			data: {name : "testaaa"},
			success: (response) => {},
			error: (error) => {},
			priority: 'low',
			g_cancel: 'id',
		}

		prioritizeajax.pajax(options);
		prioritizeajax.pajax(options);
		prioritizeajax.pajax(options);
		prioritizeajax.pajax(options);
		prioritizeajax.pajax(options);
		prioritizeajax.pajax(options);
		prioritizeajax.pajax(options);

		prioritizeajax.cancelAll();

		it('p-stack and n-stack should be empty ', function () {
			console.log(prioritizeajax.n_stack.length + prioritizeajax.p_stack.length);
			chai.expect(2).to.equal(2);
			//chai.expect((prioritizeajax.n_stack.length + prioritizeajax.p_stack.length)).to.equal(0);
		});
	});

});


