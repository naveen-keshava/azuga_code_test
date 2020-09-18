timer();

function timer(){
    const a =10;
    for(var i= 0; i< 10 ; i++){
        setTimeout(() => {
            console.log(a);
        }, 1000);
    }
}
