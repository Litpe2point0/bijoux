<!DOCTYPE html>
<html>
<head>
    <title>Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            width: 100%;
            padding: 20px;
        }
        .header, .footer {
            text-align: center;
            margin-bottom: 20px;
        }
        .header img {
            width: 100px;
        }
        .invoice-details {
            width: 100%;
            margin-bottom: 20px;
        }
        .invoice-details table {
            width: 100%;
            border-collapse: collapse;
        }
        .invoice-details th, .invoice-details td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        .invoice-details th {
            background-color: #f2f2f2;
        }
        .totals {
            width: 100%;
            margin-top: 20px;
        }
        .totals table {
            width: 100%;
            border-collapse: collapse;
        }
        .totals th, .totals td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        .totals th {
            background-color: #f2f2f2;
        }
        .signature {
            margin-top: 40px;
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your Business Name</h1>
            <p>Your business address</p>
            <p>email@yourbusinessname.co.nz</p>
        </div>
        
        <div class="invoice-details">
            <h2>Invoice</h2>
            <table>
                <tr>
                    <th>BILL TO</th>
                    <td>Your client’s name</td>
                </tr>
                <tr>
                    <th></th>
                    <td>Your client’s address</td>
                </tr>
                <tr>
                    <th>Invoice No.</th>
                    <td>2022006</td>
                </tr>
                <tr>
                    <th>Issue Date</th>
                    <td>30/6/2022</td>
                </tr>
                <tr>
                    <th>Due Date</th>
                    <td>14/7/2022</td>
                </tr>
                <tr>
                    <th>Total due (NZD)</th>
                    <td>$0.00</td>
                </tr>
            </table>
        </div>

        <div class="invoice-items">
            <table>
                <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price ($)</th>
                    <th>Amount ($)</th>
                </tr>
                <tr>
                    <td>Sample Service</td>
                    <td>0</td>
                    <td>$0.00</td>
                    <td>$0.00</td>
                </tr>
                <tr>
                    <td>Discount %</td>
                    <td></td>
                    <td></td>
                    <td>$0.00</td>
                </tr>
                <tr>
                    <td>Tax %</td>
                    <td></td>
                    <td></td>
                    <td>$0.00</td>
                </tr>
                <tr>
                    <td colspan="3">Total (NZD)</td>
                    <td>$0.00</td>
                </tr>
            </table>
        </div>

        <div class="signature">
            <p>Issued by signature</p>
        </div>

        <div class="footer">
            <p>Your business</p>
            <p>Your business address</p>
            <p>email@yourbusinessname.co.nz</p>
        </div>
    </div>
</body>



</html>
<!DOCTYPE html>
<html>
<head>
    <title>Laravel 11 Generate PDF Example - ItSolutionStuff.com</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" >
</head>
<body>
    <h1>{{ $title }}</h1>
    <p>{{ $date }}</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua.</p>
  
    <table class="table table-bordered">
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
        </tr>
        @foreach($orders as $order)
        <tr>
            <td>{{ $order->id }}</td>
            <td>{{ $order->account_id }}</td>
            <td>{{ $order->product_id }}</td>
        </tr>
        @endforeach
    </table>
  
</body>
</html>