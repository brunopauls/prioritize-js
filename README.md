# prioritize-js

A JavaScript lib to better manage and prioritize ajax requests.

## Getting Started

To get the library and build it on your own, just do

```
git clone https://github.com/brunopauls/prioritize-js.git
cd prioritize-js
npm install
```

You can install this library in your project with npm:

`npm install --save prioritizejs `

Or just download `build/prioritize.js` or `build/prioritize.min.js` and link it to your project.

## How it works

When you get a new `prioritize` object, the contructor creates 3 stacks:
* one to store all active **low priority** requests
* one to store all active **high priority** requests
* one to store all **waiting** requests

For each normal (low priority) request that is made through the `prioritize.pajax()` function, its option object is stored in the low priority stack.
When a request is completed, its options object is removed from the stack.

If a high priority request is made, all active low priority requests are cancelled, and their options object is stored in the waiting stack. As soon as all high priority requests are finished, the requests in the waiting stack are remade, and their options objects are stored in the active low priority stack again.

### Global Cancel ID

You can create requests with a global cancel ID. Calling the `prioritize.cancelGlobal()` function with a global cancel ID will cancel and remove all requests with that ID.

## Usage

Similarly to the JQuery ajax function, the prioritize-js `pajax` function expects an options object, containing the following information:

* **url**: (*string*) request url,
* **type**: (*string*) 'POST', 'GET', etc
* **data**: (*object*) data object,
* **success**: (*function*) a success callback function
* **error**: (*function*) an error callback function,
* **priority**: (*string*) 'low' or 'high',
* **g_cancel**: (*string* or *int*) global cancel ID

#### Example

```
prioritize = new prioritize();

// LOW PRIORITY POST REQUEST
prioritize.pajax({
    url: 'https://your.api.com/request',
    type: 'POST',
    data: data,
    success: function(response){// SUCCESS},
    error: function (error){// ERROR},
    priority: 'low'
});

// HIGH PRIORITY GET REQUEST
prioritize.pajax({
    url: 'https://your.api.com/request',
    type: 'GET',
    data: data,
    success: function(response){// SUCCESS},
    error: function (error){// ERROR},
    priority: 'high'
});
```