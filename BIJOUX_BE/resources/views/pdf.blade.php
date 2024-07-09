<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <title>Invoice</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet">
    <style>
        .change-font {
            font-family: 'Roboto', sans-serif;
            font-size: 14px;
        }

        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
            font-size: 16px;
            line-height: 24px;
            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            color: #555;
        }

        .invoice-box table {
            width: 100%;
            line-height: inherit;
            text-align: left;
        }

        .titleTable {
            border-bottom: 3px solid #454448;
        }

        .invoice-box table td {
            padding: 5px;
            vertical-align: top;
        }

        .invoice-box table tr td:nth-child(2) {
            text-align: right;
        }

        .invoice-box table tr.item td table td:nth-child(2) {
            text-align: left;
        }

        .invoice-box table tr.item td table td:nth-child(4) {
            text-align: right;
        }

        .invoice-box table tr.top table td {
            padding-bottom: 20px;
        }

        .invoice-box table tr.top table td.title {
            font-size: 45px;
            line-height: 45px;
            color: #333;
        }

        .invoice-box table tr.information table td {
            padding-top: 20px;
        }

        .invoice-box table tr.heading td {
            background: #ebebeb;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
        }

        .invoice-box table tr.headingDescription td {
            border-bottom: 3px solid #9d9d9d;
            font-weight: bold;
        }

        .invoice-box table tr.headingOrder td {
            background: #d1d2ff;
            font-size: larger;
            border-bottom: 2px solid #2c00f2;
            font-weight: bolder;
        }

        .invoice-box table tr.details td {
            padding-bottom: 20px;
        }

        .invoice-box table tr.item td {
            border-bottom: 1px solid #eee;
        }

        .invoice-box table tr.item.last td {
            border-bottom: none;
        }

        .invoice-box table tr.total td:nth-child(1) {
            border-top: 1px solid #eee;
            font-weight: bold;
            font-size: larger;
        }

        .invoice-box table tr.total td:nth-child(2) {
            border-top: 1px solid #eee;
            font-weight: bold;
            font-size: larger;
            color: green;
        }

        .invoice-box table tr.price td:nth-child(1) {
            border-top: 1px solid #eee;
            font-weight: bold;
        }

        .invoice-box table tr.change td:nth-child(1) {
            border-top: 1px solid #eee;
            font-weight: bold;
        }

        .invoice-box table tr.change td:nth-child(2) {
            border-top: 1px solid #eee;
            color: red;
        }

        .invoice-box table .fixed-width td:nth-child(1) {
            width: 25%;
        }

        .invoice-box table .fixed-width td:nth-child(2) {
            width: 25%;
        }

        .invoice-box table .fixed-width td:nth-child(3) {
            width: 25%;
        }

        .invoice-box table .fixed-width td:nth-child(4) {
            width: 25%;
        }

        @media only screen and (max-width: 600px) {
            .invoice-box table tr.top table td {
                width: 100%;
                display: block;
                text-align: center;
            }

            .invoice-box table tr.information table td {
                width: 100%;
                display: block;
                text-align: center;
            }
        }

        /** RTL **/
        .invoice-box.rtl {
            direction: rtl;
            font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
        }

        .invoice-box.rtl table {
            text-align: right;
        }

        .invoice-box.rtl table tr td:nth-child(2) {
            text-align: left;
        }


        /* Custom styles for warranty section */
        .warranty-section {
            border-top: 2px solid #535353;
            font-family: 'Dancing Script', cursive;
            font-size: 34px;
            font-weight: bold;
            color: black;
            text-align: center;
            margin: 20px 0;
            position: relative;
        }


        .conditions-section {
            font-family: 'Roboto', sans-serif;
            font-size: 14px;
            margin: 20px 0;
            padding: 10px;
            border: 1px solid #ddd;
            background: #f9f9f9;
            padding-bottom: 20px;
        }

        .conditions-section h5 {
            font-weight: bold;
        }

        .conditions-section ul {
            padding-left: 20px;
        }

        .warranty-details {
            text-align: center;
            margin: 10px 0;
            font-size: 20px;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;

        }
    </style>
</head>

<body>
    <div class="invoice-box">
        <table cellpadding="0" cellspacing="0">
            <tr class="top">
                <td colspan="2">
                    <table>
                        <tr class="titleTable">
                            <td class="title">
                                BIJOUX JEWELRY <!-- replace with logo link -->
                            </td>
                            <td>
                                Invoice No.{{ $order->id }}<br />
                                Issue Date: {{ $date }}<br />
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr class="information">
                <td colspan="2">
                    <table>
                        <tr>
                            <td colspan="2">
                                <h4>INVOICE TO:</h4>
                            </td>
                        </tr>
                        <tr>
                            <td class="change-font">
                                Customer Name:<br />
                                Email:<br />
                                Phone Number:<br />
                                Address:
                            </td>
                            <td class="change-font">
                                {{ $account->fullname }}<br />
                                {{ $account->email }}<br />
                                {{ $account->phone }}<br />
                                {{ $account->address }}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr class="headingOrder">
                <td>Your Order:</td>
                <td></td>
            </tr>

            <tr class="details">
                <td>Order</td>
                <td>#{{ $order->id }}</td>
            </tr>

            <tr class="headingDescription">
                <td colspan="2">Material:</td>
            </tr>

            <tr class="item">
                <td colspan="2">
                    <table class="fixed-width" width="100%">
                        <tr class="heading">
                            <td>Name</td>
                            <td>Weight (g)</td>
                            <td>Price Per Gram (VND)</td>
                            <td>Amount (VND)</td>
                        </tr>
                        @foreach($product_metal as $metal)
                            <tr>
                                <td>{{ $metal->name }}</td>
                                <td>{{ number_format($metal->weight, 2) }}</td>
                                <td>{{ $metal->sale_price_per_gram }}</td>
                                <td>{{ $metal->price }}</td>
                            </tr>
                        @endforeach
                    </table>
                </td>
            </tr>

            <tr class="headingDescription">
                <td colspan="2">Diamond:</td>
            </tr>
            <tr class="item">
                <td colspan="2">
                    <table class="fixed-width" width="100%">
                        <thead>
                            <tr class="heading">
                                <td>Name</td>
                                <td>Quantity</td>
                                <td>Unit Price (VND)</td>
                                <td>Amount (VND)</td>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($product_diamond as $diamond)
                                <tr>
                                    <td>{{ $diamond->name }}</td>
                                    <td>{{ $diamond->count }}</td>
                                    <td>{{ $diamond->unit_price }}</td>
                                    <td>{{ $diamond->price }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr class="price" align="right">
                <td>Product Price</td>
                <td>{{ $product_price }} VND</td>
            </tr>
            <tr class="price" align="right">
                <td>Production Price</td>
                <td>{{ $production_price }} VND</td>
            </tr>

            <tr class="change" align="right">
                <td>Change </td>
                @if($extra == 0)
                    <td class="change">No Change</td>
                @else
                    <td class="change">{{ $extra }} VND</td>
                @endif
            </tr>

            <tr class="total" align="right">
                <td>Total </td>
                <td>{{ $total_price }} VND</td>

            </tr>
            \
            <!-- Warranty Section -->
            <tr class="warranty-section">
                <td colspan="2" style="padding: 20px 0px">Warranty Information</td>
            </tr>

            <tr class="warranty-details">
                <td colspan="2">Warranty Expiry Date: {{ $guarantee_expired_date }}</td>
            </tr>
            <!-- End Warranty Section -->
            <tr class="conditions-section">
                <td colspan="2">
                    <h5>Conditions And Exclusions</h5>
                    <p>The foregoing Manufacturer Warranty and Complimentary Services are available only to the person
                        who purchased the covered product from Bijoux Jewelry.</p>
                    <p>Maintenance, repair, sizing or other service performed by someone other than Bijoux will void
                        your Manufacturer Warranty.</p>
                    <p>Fine jewelry is not impervious to normal wear, activities or trauma. This is particularly true
                        for rings since hands are regularly subjected to considerable abuse. We do not provide
                        warranties for damage due to normal wear, product loss, loss of stones or theft. Damage or loss
                        that results from failure to obtain repairs necessary to maintain the integrity of the product
                        are also not covered.</p>
                    <p>Some examples of common jewelry issues that would not be considered manufacturing defects
                        include:</p>
                    <ul>
                        <li>Discoloration due to exposure to chemicals, make-up, swimming pools, hot tubs or bathing.
                        </li>
                        <li>Prongs and precious metals, in general, wear over time and may require “building up” or
                            restoration work as normal wear.</li>
                        <li>Bent, caught or worn out prongs(s) allowing a stone to fall out or be lost due to normal
                            wear or other damage.</li>
                        <li>Lost stone or a stone has fallen out due to chipping or breaking caused by normal wear or
                            other damage.</li>
                    </ul>
                </td>
            </tr>
            </tr>
        </table>
        <div class="text-center mt-4"
            style="font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-size: larger; padding-top: 50px; border-top: 1px solid black;">
            <p>Thank you for your business!</p>
        </div>
        <div class="footer text-center mt-4"
            style="font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif">
            <p>If you have any questions about this invoice, please contact us at:</p>
            <p>Email: bijouxjewelryoriginal@gmail.com | Phone: +1 123-456-7890</p>
            <p>Bijoux Jewelry</p>
        </div>
    </div>
</body>

</html>