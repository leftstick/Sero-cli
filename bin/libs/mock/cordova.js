(function(document, navigator) {

    navigator.notification = {};
    var notify = navigator.notification;

    notify.alert = function(l1, l2) {
        console.log('alert', l1, l2);
    };

    notify.confirm = function(l1, l2) {
        console.log('confirm', l1, l2);
    };

    notify.prompt = function(l1, l2) {
        console.log('prompt', l1, l2);
    };

    notify.beep = function(l1) {
        console.log('beep', l1);
    };



}(document, navigator));
