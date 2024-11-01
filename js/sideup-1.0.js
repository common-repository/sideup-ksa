let  mainToken ;
let  mainTarget ;
let  mainItemCost ;
let  mainPaymentGetWays ;
let  mainTax ;
let  mainTaxType ;
let  baseUrl = 'https://portal.sa.sideup.co' ;
// let  baseUrl = 'http://sa.sideup.test' ;
jQuery(document).ready(function($){
    // alert('Hello World!');
    $(".cancel-button").on('click', function(e) {
        e.preventDefault();
        Swal.fire({
            title: "Please Wait While Send Your Cancel Request",
            icon: 'info',
            showConfirmButton: false,
        })
        let target = $(this).attr('data-key');
        let token = $(this).attr('bearerToken');

        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Authorization': `${token}`,
                },
            url:`${baseUrl}/api/cancelWooCommerceOrder`,
            data: {
                woocommerce_id: target,
            },
            method: "POST",
            success:function(response){
                return true;
            },
            error:function(error){
                return false;
            },
        }).then(response => {
            location.reload();
        }).catch(e => {
            Swal.fire({
                title: 'It seems you missed something, please contact with your account manager to help you and solve this issue.',
                confirmButtonText: `OK`,
            })
        })
    });


    $(".newShipping-button").on('click', function(e) {
        e.preventDefault();
        let city = $(this).attr('data-city');
        let item_cost = Number($(this).attr('data-total'));
        let target = $(this).attr('data-key');
        let token = $(this).attr('bearerToken');
        mainToken= token ;
        mainItemCost = item_cost ;
        console.log(mainToken);
        $.ajax({
            // url: "https://portal.eg.sideup.co/api/localPrices",
            url: baseUrl +"/api/paymentGetWay",
            type: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader('Authorization', token);},
            success: function(response){
                console.log(response);
                mainPaymentGetWays = response.data.paymentGetWay;
                console.log(mainPaymentGetWays);
                mainTax = response.tax;
                mainTaxType = response.tax_type;
            }
        });
        $result = $.ajax({
                        // url: "https://portal.eg.sideup.co/api/localPrices",
                        url: baseUrl +"/api/getCities",
                        type: "GET",
                        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', token);},
                        success: function(response) {

                            // console.log(response.data);
                            var cities = response.data;
                            // console.log(cities);
                            // cities.forEach(optionCities)
                            var drop_main_city_id = city;
                            var pickupZoneId = response['pickup zone'];
                            var mylerzNotPlaces = ["Benisuif", "Fayoum", "Minya", "Asyut", "Souhag", "Quena", "Luxor", "Aswecpt_save_postan", "Sharm el-sheikh", "Hurghada", "Marsa Matrouh", "elwadi elgedid", "Elwahat", "oases"];
                            var fetchrNotPlaces = ["Benisuif", "Fayoum", "Minya", "Asyut", "Souhag", "Quena", "Luxor", "Aswan", "Sharm el-sheikh", "Hurghada", "Marsa Matrouh", "elwadi elgedid", "Elwahat", "oases"];

                            var mylerzNotexist = mylerzNotPlaces.includes(drop_main_city_id);
                            var hideMylerz = (mylerzNotexist || pickupZoneId!=93 ) && (mylerzNotexist || pickupZoneId!=45) && (mylerzNotexist || pickupZoneId!=92);

                            var fetchrNotexist = fetchrNotPlaces.includes(drop_main_city_id);
                            var hideFetchr = fetchrNotexist;
                            mylerzFees = Number(response.data.Fedex) - 5;
                            console.log(response.data.Fedex, response.data.Aramex, Math.ceil(((item_cost) - 2500) / 1000) * 7);
                            $fedex_total_fees = (item_cost > 2500) ?  Number(response.data.Fedex) + Math.ceil((((item_cost) - 2500)) * 7 / 1000) : Number(response.data.Fedex);
                            $mylerz_total_fees = (item_cost > 2500) ?  Number(mylerzFees) + Math.ceil((((item_cost) - 2500)) * 7 / 1000) : Number(mylerzFees);
                            $fetchr_total_fees = (item_cost > 2500) ?  Number(response.data.Fetchr) + Math.ceil((((item_cost) - 2500)) * 7 / 1000) : Number(response.data.Fetchr);
                            $jt_total_fees = (item_cost > 2500) ?  Number(response.data.Jt) + Math.ceil((((item_cost) - 2500)) * 7 / 1000) : Number(response.data.Jt);
                            $aramex_total_fees = (item_cost > 2500) ?  Number(response.data.Aramex) + Math.ceil((((item_cost) - 2500)) * 7 / 1000) : Number(response.data.Aramex);
                            $(".fedex-total-fees").val($fedex_total_fees);
                            $(".fetchr-total-fees").val($fetchr_total_fees);
                            $(".jt-total-fees").val($jt_total_fees);
                            $(".aramex-total-fees").val($aramex_total_fees);
                            $(".mylerz-total-fees").val($mylerz_total_fees);
                            console.log(item_cost, $fedex_total_fees, $mylerz_total_fees, $fetchr_total_fees, $jt_total_fees,$aramex_total_fees);
                            target = target;
                            mainTarget= target ;
                            Swal.fire({
                                title: 'Choose Courier and Payment Method',
                                html:
                                    `
                                    <div class="" style="text-align:center"><h3>Add receiver backup Phone Number (OPTIONAL)</h3></div>
                                    <input type="text" id="backup-mobile" target=${target} value="" placeholder="05xxxxxxxxx">
                                    <br>
                                    <div class="row">
                                        <div class="col-md-6">
                                        <div class="" style="text-align:center"><h3>Cities (Required)</h3></div>
                                        <select id="citiesSelected" onChange="getAreas()"> 
                                             <option value="">select City</option>
                                        </select>
                                        </div>
                                        <div class="col-md-6">
                                        <div class="" style="text-align:center"><h3>Areas (Required)</h3></div>
                                        <select id="areasSelected" target=${target} onChange="getPrices()"> 
                                            <option value="">select area</option>
                                        </select>
                                        </div>
                                    </div>
                                    <br>
                                    <div class="" style="text-align:center"><h2>Total Cash Collection</h2></div>
                                    <input type="number" id="item-cost" target=${target} value=${item_cost} onChange="getPrices()">
                                    <br>
                                    <span class="badge badge-primary">This is the cost that will be collected from your client if you choose Cash OnDlivery <!-- or Online Payment-->.</span>
                                    <br>
                                    <span class="badge badge-primary">This will be 0 automatically if you chooce Zero Cash Collection.</span>
                                    <div class="" style="text-align:center"><h2>Select Payment Way</h2></div>
                                    <div class="" style="text-align:initial" id="paymentGetWayDiv">

                                    </div>
                                    </div>
                                    <div class="" id="selectCourier" style="text-align:center;display:none"><h2>Select Courier</h2></div>
                                    <input type="hidden" id="payment-way" value="4">
                                    <div class="row" id="couriers_div">
                                    
                                    
                                    </div>`,
                                focusConfirm: false,
                                showConfirmButton: false,
                            })

                            for (var i = 0; i < cities.length; i++){
                                var option = cities[i];
                                $('#citiesSelected').append(`<option value="${option.id}" id="${'city'+option.id}" >${option.name} </option>`)
                            }
                            // $('#paymentGetWayDiv').innerHTML = '';
                            var paymentGetWayDiv = document.getElementById('paymentGetWayDiv')
                            var totalCash = document.getElementById('item-cost').value;
                            console.log(paymentGetWayDiv,mainPaymentGetWays);

                            paymentGetWayDiv.innerHTML = '';

                            for (const index in mainPaymentGetWays) {
                                var paymentGetWay = mainPaymentGetWays[index];
                                console.log(paymentGetWay);
                                var checked =  (paymentGetWay.value === 'COD') ? 'checked' : '';
                                var paymentFess = (paymentGetWay.cash_type === 'fixed') ? paymentGetWay.cash : Math.ceil(totalCash * (paymentGetWay.cash /100));
                                var div = `<div class="mb-3 form-check item-details">
                                    <input class="form-check-input paymentWay" type="radio"  name="paymentWay" id="${paymentGetWay.value}" value="${paymentGetWay.key}" onchange="getPrices()" ${checked} target=${target}>
                                    <label class="form-check-label ml-4" for="${paymentGetWay.value}">
                                        ${paymentGetWay.label}
                                    </label>
                                    <input type="number" id="${paymentGetWay.key}" value="${paymentFess}" readonly>
                                    <br>
<!--                                    <span class="badge badge-primary">COD amount exceeds 2500 LE, 7 EGP for each 1000 EGP will apply.</span>-->
<!--                                    <br>-->
                                    <span class="badge badge-primary">${paymentGetWay.notes}</span>
                                    </div>`;

                                // selectCourier.style.display = 'block';
                                paymentGetWayDiv.innerHTML += div;
                            }




                        }
                    });
        // swal.fire('HELLO');
    });

    $(document).on('change', 'input[type=radio][name=paymentWay]', function() {
        id = $(this).attr('target');
        $(`.payment-way`).val($(this).val());
        row = $(`#${$(this).attr('target')}`);
        item_cost = Number($("#item-cost").val());
        base_fedex_fees = $(".base-fedex-fees").val();
        base_fetchr_fees = $(".base-fetchr-fees").val();
        base_jt_fees = $(".base-jt-fees").val();
        base_aramex_fees = $(".base-aramex-fees").val();
        base_mylerz_fees = $(".base-mylerz-fees").val();
        console.log($(this).val(), 'HELLO', item_cost);
        if($(this).val() == '4') {
            $(".fedex-total-fees").val(((item_cost) > 2500) ?  Number(base_fedex_fees) + Math.ceil((((Number(base_fedex_fees) + item_cost) - 2500)) * 7 / 1000) : Number(base_fedex_fees));
            $(".fetchr-total-fees").val(((item_cost) > 2500) ?  Number(base_fetchr_fees) + Math.ceil((((Number(base_fetchr_fees) + item_cost) - 2500)) * 7 / 1000) : Number(base_fetchr_fees));
            $(".jt-total-fees").val(((item_cost) > 2500) ?  Number(base_jt_fees) + Math.ceil((((Number(base_jt_fees) + item_cost) - 2500)) * 7 / 1000) : Number(base_jt_fees));
            $(".aramex-total-fees").val(((item_cost) > 2500) ?  Number(base_aramex_fees) + Math.ceil((((Number(base_aramex_fees) + item_cost) - 2500)) * 7 / 1000) : Number(base_aramex_fees));
            $(".mylerz-total-fees").val(((item_cost) > 2500) ?  Number(base_mylerz_fees) + Math.ceil((((Number(base_mylerz_fees) + item_cost) - 2500)) * 7 / 1000) : Number(base_mylerz_fees));
        } else if($(this).val() == '1') {
            $(".fedex-total-fees").val(Math.ceil((Number(base_fedex_fees)) + (0.03 * (item_cost))));
            $(".fetchr-total-fees").val(Math.ceil((Number(base_fetchr_fees)) + (0.03 * (item_cost))));
            $(".jt-total-fees").val(Math.ceil((Number(base_jt_fees)) + (0.03 * (item_cost))));
            $(".aramex-total-fees").val(Math.ceil((Number(base_aramex_fees)) + (0.03 * (item_cost))));
            $(".mylerz-total-fees").val(Math.ceil((Number(base_mylerz_fees)) + (0.03 * (item_cost))));
        } else if($(this).val() == '2') {
            $(".fedex-total-fees").val(Math.ceil((Number(base_fedex_fees)) + (0.03 * (item_cost))));
            $(".fetchr-total-fees").val(Math.ceil((Number(base_fetchr_fees)) + (0.03 * (item_cost))));
            $(".jt-total-fees").val(Math.ceil((Number(base_jt_fees)) + (0.03 * (item_cost))));
            $(".aramex-total-fees").val(Math.ceil((Number(base_aramex_fees)) + (0.03 * (item_cost))));
            $(".mylerz-total-fees").val(Math.ceil((Number(base_mylerz_fees)) + (0.03 * (item_cost))));
        } else if($(this).val() == '3') {
            $(".fedex-total-fees").val(base_fedex_fees);
            $(".fetchr-total-fees").val(base_fetchr_fees);
            $(".jt-total-fees").val(base_jt_fees);
            $(".aramex-total-fees").val(base_aramex_fees);
            $(".mylerz-total-fees").val(base_mylerz_fees);
            $("#item-cost").val(0);
        } else {
            return;
        }
    });

    $(document).on('keyup', '#backup-mobile', function() {
        id = $(this).attr('target');
        // $(`.payment-way`).val();
        row = $(`#${id}`);
        row.attr('data-backup-phone', $(this).val());
    });

    $(document).on('change', '#item-cost', function() {
        id = $(this).attr('target');
        // $(`.payment-way`).val();
        row = $(`#${id}`);
        console.log(id, row);
        // target = $(`#${row}`);
        item_cost = Number($(this).val());
        row.attr('data-total', item_cost);
        console.log(row);
        base_fedex_fees = $(".base-fedex-fees").val();
        base_fetchr_fees = $(".base-fetchr-fees").val();
        base_jt_fees = $(".base-jt-fees").val();
        base_aramex_fees = $(".base-aramex-fees").val();
        base_mylerz_fees = $(".base-mylerz-fees").val();
        console.log($(this).val(), 'HELLO', item_cost, $('input[type=radio][name="paymentWay"]:checked').val());
        if($('input[type=radio][name="paymentWay"]:checked').val() == '4') {
            $(".fedex-total-fees").val(((item_cost) > 2500) ?  Number(base_fedex_fees) + Math.ceil((((Number(base_fedex_fees) + item_cost) - 2500)) * 7 / 1000) : Number(base_fedex_fees));
            $(".fetchr-total-fees").val(((item_cost) > 2500) ?  Number(base_fetchr_fees) + Math.ceil((((Number(base_fetchr_fees) + item_cost) - 2500)) * 7 / 1000) : Number(base_fetchr_fees));
            $(".jt-total-fees").val(((item_cost) > 2500) ?  Number(base_jt_fees) + Math.ceil((((Number(base_jt_fees) + item_cost) - 2500)) * 7 / 1000) : Number(base_jt_fees));
            $(".aramex-total-fees").val(((item_cost) > 2500) ?  Number(base_aramex_fees) + Math.ceil((((Number(base_aramex_fees) + item_cost) - 2500)) * 7 / 1000) : Number(base_aramex_fees));
            $(".mylerz-total-fees").val(((item_cost) > 2500) ?  Number(base_mylerz_fees) + Math.ceil((((Number(base_mylerz_fees) + item_cost) - 2500)) * 7 / 1000) : Number(base_mylerz_fees));
        } else if($(`.payment-way`).val() == '1') {
            $(".fedex-total-fees").val(Math.ceil((Number(base_fedex_fees)) + (0.03 * (item_cost))));
            $(".fetchr-total-fees").val(Math.ceil((Number(base_fetchr_fees)) + (0.03 * (item_cost))));
            $(".jt-total-fees").val(Math.ceil((Number(base_jt_fees)) + (0.03 * (item_cost))));
            $(".aramex-total-fees").val(Math.ceil((Number(base_aramex_fees)) + (0.03 * (item_cost))));
            $(".mylerz-total-fees").val(Math.ceil((Number(base_mylerz_fees)) + (0.03 * (item_cost))));
        } else if($(`.payment-way`).val() == '2') {
            $(".fedex-total-fees").val(Math.ceil((Number(base_fedex_fees)) + (0.03 * (item_cost))));
            $(".fetchr-total-fees").val(Math.ceil((Number(base_fetchr_fees)) + (0.03 * (item_cost))));
            $(".jt-total-fees").val(Math.ceil((Number(base_jt_fees)) + (0.03 * (item_cost))));
            $(".aramex-total-fees").val(Math.ceil((Number(base_aramex_fees)) + (0.03 * (item_cost))));
            $(".mylerz-total-fees").val(Math.ceil((Number(base_mylerz_fees)) + (0.03 * (item_cost))));
        } else if($(`.payment-way`).val() == '3') {
            $(".fedex-total-fees").val(base_fedex_fees);
            $(".fetchr-total-fees").val(base_fetchr_fees);
            $(".jt-total-fees").val(base_jt_fees);
            $(".aramex-total-fees").val(base_aramex_fees);
            $(".mylerz-total-fees").val(base_mylerz_fees);
            $("#item-cost").val(0);
        } else {
            return;
        }
    });

    $(document).on('click', '.ship-order', function() {
        Swal.fire({
            title: "Please Wait While Send Your Order",
            icon: 'info',
            showConfirmButton: false,
        })
        id = $(this).attr('target');
        target = $(`#${id}`);
        bearerToken      = target.attr("bearerToken");
        woocommerce_id   = target.attr('id');
        shipment_code    = Math.floor(1000000 + Math.random() * 9000000);
        name             = target.attr('data-name');
        phone            = target.attr('data-mobile');
        // area_id          = target.attr('data-city');
        area_id          = $(this).attr('area-id');
        address          = target.attr('data-address');
        item_description = target.attr('data-description');
        item_cost        = target.attr('data-total');
        backup_mobile    = target.attr('data-backup-phone');
        courier          = $(this).attr('courier');
        landmark         = null;
        notes            = `WooCommerce Order`;
        // payment_way      = $(`.payment-way`).val();
        payment_way      = document.querySelector('input[name="paymentWay"]:checked');
        // payment_way      = $('.paymentWay:checked').val();
        wordpress_id     = target.attr('data-wordpress-id');
        zero_cash_collection = 0;
        total_cash_collection = Number(item_cost);
        if(payment_way == 1) {
            online_payment = 'online_payment';
        } else if(payment_way == 2) {
            online_payment = 'fawry_payment';
        } else if(payment_way == 3) {
            online_payment = null;
            zero_cash_collection = 1;
            total_cash_collection = 0;
        } else if(payment_way == 4) {
            online_payment = 'cod';
        } else {
            online_payment = null;
        }

        console.log(shipment_code    ,
                    payment_way      ,
                    name             ,
                    phone            ,
                    area_id          ,
                    address          ,
                    item_description ,
                    item_cost        ,
                    courier          ,
                    landmark         ,
                    notes            ,
                    zero_cash_collection,
                    online_payment,
                    total_cash_collection,
                    backup_mobile,
                    Number($(`.${courier}-total-fees`).val()));

        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Authorization': `${bearerToken}`,
                },
            url:`${baseUrl}/api/orders`,
            data: {
                //shipment_code    : shipment_code   ,
                name             : name            ,
                phone            : phone           ,
                area_id          : area_id         ,
                address          : address         ,
                item_description : item_description,
                // item_cost        : item_cost       ,
                courier          : courier         ,
                // landmark         : landmark        ,
                notes            : notes           ,
                isWooCommerce    : true            ,
                woocommerce_id   : woocommerce_id  ,
                zero_cash_collection : zero_cash_collection,
                online_payment   : online_payment  ,
                total_cash_collection : total_cash_collection,
                backup_mobile    : backup_mobile,
            },
            method: "POST",
            success:function(response){
                return true;
            },
            error:function(error){
                return false;
            },
        }).then(response => {
            location.reload();
        }).catch(e => {
            console.log(e.message,e);
            Swal.fire({
                title: 'It seems you missed something, please contact with your account manager to help you and solve this issue.',
                confirmButtonText: `OK`,
            })
        })
    });
});
var getAreas = ()=> {
    var optionSelected = document.getElementById("citiesSelected");
    console.log(optionSelected.value);
    var areasSelected = document.getElementById("areasSelected");

    while (areasSelected.firstChild) {
        areasSelected.firstChild.remove()
    }

    var selectAreaOption = document.createElement("option");
    selectAreaOption.text = 'Select Area';
    selectAreaOption.value = '';
    // selectAreaOption.id = 'area'+option.id;
    areasSelected.appendChild(selectAreaOption);

    var city_id = null;
    if(optionSelected)
    {
        city_id = optionSelected.value;
    }
    // var url = baseUrl +"/api/getAreas"+"?cityOrZoneId=city"+city_id;
    var url = baseUrl +"/api/zones/get_areas_by_city_id/"+city_id;
    fetch(url, { method: 'GET' ,headers: {
            'Content-Type': 'application/json',
            'Authorization': mainToken,
        }, })

        .then(Result => Result.json())
        .then(response => {

            console.log(response);
            var areas = response.data;

            console.log( areas.length );

            for (var i = 0; i < areas.length; i++){
                var option = areas[i];
                var createOption = document.createElement("option");
                createOption.text = option.name;
                createOption.value = option.id;
                createOption.id = 'area'+option.id;
                areasSelected.appendChild(createOption);
                console.log( createOption );
                // $('#areasSelected').append(`<option value="${option.id}" id="${'area'+option.id}" >${option.name} </option>`)
            }

        })
        .catch(errorMsg => { console.log(errorMsg); });
}
var getPrices = ()=> {
    var optionSelected = document.getElementById("areasSelected");
    console.log(optionSelected.value);
    var area_id = null;
    if(optionSelected)
    {
        area_id = optionSelected.value;
    }
    var itemCost = document.getElementById("item-cost");
    mainItemCost = itemCost && itemCost.value ? itemCost.value : mainItemCost;


    if (area_id && mainItemCost) {
        // var paymentWay = $("input[name='paymentWay']:checked").val();
        var paymentWay = document.querySelector('input[name="paymentWay"]:checked').id;
        console.log(mainToken)
        var url = baseUrl +"/api/CouriersLocalPrices?drop_area_id=" + area_id + "&total_cash=" + mainItemCost+"&payment_way_key=" +( paymentWay??null);
        fetch(url, {
            method: 'GET',
            // crossorigin: true,
            // mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin' : '*',
                'Authorization': mainToken,
            },
        })
            .then(Result => Result.json())
            .then(response => {

                var couriers_div = document.getElementById('couriers_div');
                var selectCourier = document.getElementById('selectCourier');
                couriers_div.innerHTML = '';
                selectCourier.style.display = 'none';
                var couriers = response.data;
                var area_id = document.getElementById('areasSelected').value;
                for (const courierName in couriers) {
                    var courier = couriers[courierName];
                    var div = `<div class="item-details">
                                        <div class="top2">
                                            <img class="img-fluid" src="${courier.image}" style="width: 120px;">
                                        </div>
                                        <span class="font-md regular text-capitalize "></span>
                                        <div class="delivery-fees">
                                            <span class="font-sm">Delivery Fees</span>
                                            <input class="form-control input-back fedex-total-fees" style="margin : 0 auto; width: 80% !important;height: auto;top: 100px;opacity:1;" name="delivery_fees" disabled="" value="${courier.price}">
                                            <span class="font-sm">Tax Fees</span>
                                            <input class="form-control input-back fedex-total-fees" style="margin : 0 auto; width: 80% !important;height: auto;top: 100px;opacity:1;" name="tax" disabled="" value="${courier.tax}">
                                            <button class="btn btn-primary ship-order" area-id=${area_id} target=${mainTarget} courier=${courierName}>Ship</button>
                                            <input class="base-fedex-fees" hidden type="text" value="${(Number(courier.price))}">
                                        </div>
                                    </div>`;

                    selectCourier.style.display = 'block';
                    couriers_div.innerHTML += div;
                }

            })
            .catch(errorMsg => {
                console.log(errorMsg);
            });
    }
}