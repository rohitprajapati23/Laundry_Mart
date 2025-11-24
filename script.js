
//======================Service-Table & Balance Update====================//


let addedItems = [];

let buttons = document.querySelectorAll('.service-btn');
let serviceMsg = document.getElementById('service-msg');
buttons.forEach(function(button) {
    button.addEventListener('click', function() {
        if(addedItems.length !== -1){
        serviceMsg.innerText=''
        }
    
        let name = button.getAttribute('service-name');
        let price = parseInt(button.getAttribute('service-price'));

        let added = false;
        for(let i = 0; i < addedItems.length; i++){
            if(addedItems[i].name === name){
                addedItems.splice(i, 1);
                added = true;
                break;
            }
        }

        if(added === false){
            addedItems.push({name: name, price: price});
        }

        if(added){
            button.innerText='Add Item';
            button.style.backgroundColor='green'
            
        } else{
            button.innerText='Remove';
            button.style.backgroundColor='red'
            
        }
        updItems();
    })
});

function updItems(){
    let table = document.querySelector('#serviceTable tbody');
    table.innerHTML='';

    let total = 0;
    for(let i = 0; i < addedItems.length; i++){
        let addServices = document.createElement('tr');
        addServices.innerHTML=`
        <td>${i + 1}</td>
        <td>${addedItems[i].name}</td>
        <td>$${addedItems[i].price}</td>
        `;
        table.append(addServices);

        total += addedItems[i].price;
    }

    
    document.getElementById('balance').innerText = `$${total}`;
}





// //===============Booking Form & Email Confirmation===================//

let fullName = document.getElementById('name');
let email = document.getElementById('email');
let phone = document.getElementById('phone');
let book = document.getElementById('book-btn');
let msg = document.getElementById('book-msg');


book.addEventListener('click', () => {
    if(fullName.value && email.value && phone.value){
        msg.innerText='';
    
    } else {
        msg.innerText='Your booking has not been submitted!';
        msg.style.color='red';
        
    }
    
})




document.getElementById('book-btn').addEventListener('click', function(e){
    e.preventDefault();
    
    let form = document.getElementById('form');
    if (!form.reportValidity()) {
        return;
    }
    
    if (addedItems.length === 0) {
        serviceMsg.innerText='No item added. Please add service items.';
        serviceMsg.style.color='red';
        
        e.preventDefault();
        return;
    }
    

    let services = addedItems.map(item => item.name).join(", ");
    let totalAmount = addedItems.reduce((sum, item) => sum + item.price, 0);

    let emailMsg = {
        fullName: fullName.value,
        email: email.value,
        phone: phone.value,
        services: services,
        total: totalAmount
    };

    let userMsg = {
        fullName: fullName.value,
        email: email.value,
        services: services,
        total: totalAmount
    };

    emailjs.send("service_wj4t25z", "template_7t6un8o", emailMsg)

    .then(function () {
    emailjs.send("service_wj4t25z", "template_mt205kl", userMsg);
    })

    


        
    .then(function(response) {
        msg.innerText = "Your booking is confirmed!";
        msg.style.color = "green";
        document.getElementById('form').reset();

        addedItems = [];
        buttons.forEach(btn => {
            btn.textContent = "Add Item";
            btn.style.backgroundColor = "green";
        });
        updItems();

    },
    function(error) {
        msg.innerText = "Request failed!";
        msg.style.color = "red";
    }
);
});

