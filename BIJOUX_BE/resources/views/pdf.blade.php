<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <title>Invoice</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
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

        .invoice-box table tr.total td:nth-child(2) {
            border-top: 1px solid #eee;
            font-weight: bold;
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
                                Invoice NO.: {{ $payment->id }}<br />
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
                <td>Order#</td>
            </tr>

            <tr class="details">
                <td>Order</td>
                <td>{{ $order->id }}#</td>
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
                            <td>{{ number_format($metal->weight, 2) }} g</td>
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
            <tr class="total" align="right">
                <td>Product Price</td>
                <td>{{ $product_price }}</td>
            </tr>
            <tr class="total" align="right">
                <td>Production Price</td>
                <td>{{ $production_price }}</td>
            </tr>
            <tr class="total" align="right">
                <td>Total (VND)</td>
                <td>{{ $total_price }}</td>
            </tr>
        </table>
        <div class="text-center mt-4" style="font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-size: larger; padding-top: 50px;">
            <p>Thank you for your business!</p>
        </div>
        <div class="footer text-center mt-4" style="font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif">
            <p>If you have any questions about this invoice, please contact us at:</p>
            <p>Email: bijouxjewelryoriginal@gmail.com | Phone: +1 123-456-7890</p>
            <p>Bijoux Jewelry</p>
        </div>
    </div>
</body>

</html>