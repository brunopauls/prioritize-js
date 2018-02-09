"use strict";
import isEmptyObject from 'is-empty-object';
import axios from 'axios';
import qs from 'qs';

class prioritize {

    constructor() {
        // Array of normal priority requests
        this.n_stack = [];

        // Array of high priority requests
        this.p_stack = [];

        // Array of requests put on hold
        this.waiting_stack = [];
    }

    /** General function for all types of requests.
    * Expects an options object, with the following parameters:
    * {
    *   url: request url,
    *   type: request type,
    *   data: data object,
    *   success: function,
    *   error: function,
    *   priority: "low" or "high",
    *   g_cancel: global cancel ID
    * }
    */
    pajax (options = null) {
        // Return if no options are given
        if (options == null || isEmptyObject(options)){
            return false;
        }

        // Create a token to cancel this request
        var CancelToken = axios.CancelToken;
        var source = CancelToken.source();
        options.cancelToken = source.token;
        options.source = source;

        // Different actions before request, depending on the priority
        if (options.priority == 'low'){
            // Save options
            this.n_stack.push(options);
        } else if (options.priority == 'high'){
            // Put n-stak requests on hold, and save those options in wait-stack
            this.holdNStack();

            // Save current options
            this.p_stack.push(options);
        }
        console.log(options.data,  qs.stringify(options.data));
        //Make the actual request
        return axios({
            method: options.type,
            url: options.url,
            data: qs.stringify(options.data),
            cancelToken: options.cancelToken
        })
        .then((response) => {
            options.priority == 'high' ? this.highPCleanUp(options.cancelToken) : this.lowPCleanUp(options.cancelToken);
            if (options.success){
                options.success(response);
            }
        })
        .catch((error) => {
            options.priority == 'high' ? this.highPCleanUp(options.cancelToken) : this.lowPCleanUp(options.cancelToken);
            if (options.error){
                options.error(error);
            }
        });
    }

    /**
     * Hold N-Stack function
     * Puts all requests in the normal priority stack on hold,
     * and stores their options in a waiting stack
     */
    holdNStack (){
        // For each request in the n-stack
        // iterate backwards, to splice items without breaking indexes
        var i = this.n_stack.length;
        while (i--){
            // Cancel request associated with it.
            this.n_stack[i].source.cancel();

            // Save data in waiting stack
            this.waiting_stack.push(this.n_stack[i]);

            // Remove entry from n-stack
            this.n_stack.splice(i, 1);
        }
    }

    /**
     * High Priority Clean Up function
     * 
     */
    highPCleanUp (cancelToken) {
        // Remove entry from P-Stack
        for (var i = 0; i < this.p_stack.length; i++){
            if (this.p_stack[i].cancelToken == cancelToken){
                this.p_stack.splice(i, 1);
            }
        }

        // Reinstate all requests from the waiting-stack (if the p-stack is empty)
        if (this.p_stack.length <= 0){
            this.restartWaitingRequests();
        }
    }

    /**
     * Low Priority Clean Up function
     * After a normal (low) priority request returns (successfully or not),
     * clean up what it used in the class
     */
    lowPCleanUp (cancelToken) {
        // Remove entry from N-Stack
        for (var i = 0; i < this.n_stack.length; i++){
            if (this.n_stack[i].cancelToken == cancelToken){
                this.n_stack.splice(i, 1);
            }
        }
    }

    /**
     * Restart Waiting Requests
     * 
     */
    restartWaitingRequests () {
        console.log("restart waiting");
        var i = this.waiting_stack.length;
        while (i--){
            // Make request
            this.pajax(this.waiting_stack[i]);

            // Remove entry from waiting stack
            this.waiting_stack.splice(i, 1);
        }
    }

    /***
     * Cancel by global cancel id
     */
    cancelGlobal (g_cancel) {
        // Cancel from high priority stack
        var i = this.p_stack.length;
        while (i--){
            if (this.p_stack[i].g_cancel == g_cancel){
                // Cancel request
                this.p_stack[i].source.cancel();

                // Remove entry from p-stack
                this.p_stack.splice(i, 1);
            }
        }

        // Cacel from low priority stack
        var i = this.n_stack.length;
        while (i--){
            console.log(this.n_stack[i].g_cancel);
            if (this.n_stack[i].g_cancel == g_cancel){
                console.log("CANCEL!");
                // Cancel request
                this.n_stack[i].source.cancel();

                // Remove entry from n-stack
                this.n_stack.splice(i, 1);
                console.log(this.n_stack.length);
            }
        }
    }

    cancelAll () {
        // Cancel from high priority stack
        var i = this.p_stack.length;
        while (i--){
            // Cancel request
            this.p_stack[i].source.cancel();

            // Remove entry from p-stack
            this.p_stack.splice(i, 1);
            console.log("p - ", this.p_stack.length);
        }

        // Cacel from low priority stack
        var i = this.n_stack.length;
        while (i--){
            // Cancel request
            this.n_stack[i].source.cancel();

            // Remove entry from n-stack
            this.n_stack.splice(i, 1);
            console.log("l - ", this.n_stack.length);
        }
    }
}

module.exports = prioritize;