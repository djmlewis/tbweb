/**
 * Created by davidlewis on 10/05/2016.
 */
function MyClass () { // constructor function
    var privateVariable = "foo";  // Private variable

    this.publicVariable = "bar";  // Public variable

    this.privilegedMethod = function () {  // Public Method
        alert(privateVariable);
    };
}

// Instance method will be available to all instances but only load once in memory
MyClass.prototype.publicMethod = function () {
    alert(this.publicVariable);
};

// Static variable shared by all instances
MyClass.staticProperty = "baz";

var myInstance = new MyClass();
/*
staticProperty is defined in the MyClass object (which is a function)
and has nothing to do with its created instances, JavaScript treats functions as first-class objects,
    so being an object, you can assign properties to a function
    */

