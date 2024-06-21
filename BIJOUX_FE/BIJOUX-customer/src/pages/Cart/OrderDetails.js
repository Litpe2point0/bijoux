import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdArrowDropleft } from "react-icons/io";
import OrderStepper from "../../components/Cart/Orders/orderStepper";
import { gold, silver } from "../../assets/images";
import OrderInformations from "../../components/Cart/Orders/orderInformations";
import ManufactureProgress from "../../components/Cart/Orders/manufactureProgress";
import DesignProcess from "../../components/Cart/Orders/designProcess";
import { get_order_detail, get_order_detail_customer } from "../../api/main/orders/Order_api";

// const orderDetail_data = {
//     id: 1,
//     imageUrl: "https://i.pinimg.com/564x/a5/00/6e/a5006ea7360527e1f4f94b3f75bed2d3.jpg",
//     product: {
//         id: 1,
//         imageUrl: "https://i.pinimg.com/564x/a5/00/6e/a5006ea7360527e1f4f94b3f75bed2d3.jpg",
//         mounting_type: { id: 1, name: "Ring" }, //có thể null
//         model: null,
//         mounting_size: 8,
//         product_diamond: [
//             {
//                 id: 1,
//                 product_id: 1,
//                 diamond: {
//                     id: 1,
//                     imageUrl: "https://ion.bluenile.com/sgmdirect/photoID/35192812/Diamond/21626610/nl/Diamond-round-1-Carat_3_first_.jpg",
//                     size: 6,
//                     diamond_color: { id: 1, name: "D" },
//                     diamond_origin: { id: 1, name: "Natural" },
//                     diamond_clarity: { id: 1, name: "IF" },
//                     diamond_cut: { id: 1, name: "Excellent" },
//                     price: 10000000,
//                     deactivated: 0,
//                     created: "15/06/2024"
//                 },
//                 diamond_shape: { id: 9, name: "Heart", drawing_path: "M 11.46 0.893 c 0.934 -0.261 1.718 -0.25 2.659 -0.007 c 1.119 0.29 2.007 0.999 2.538 2.298 c 0.475 1.162 0.439 2.752 0.003 4.302 c -0.444 1.579 -1.142 2.877 -2.15 4.041 q -0.691 0.797 -1.48 1.494 l -0.006 0.089 l -0.077 0.066 l -0.084 -0.009 q -0.87 0.75 -1.827 1.389 a 17 17 0 0 1 -1.515 0.9 l -0.176 0.09 l -0.16 0.08 l -0.157 0.074 h -0.056 l -0.158 -0.075 l -0.16 -0.078 l -0.175 -0.09 l -0.093 -0.05 a 17 17 0 0 1 -1.422 -0.851 a 19 19 0 0 1 -1.827 -1.389 l -0.085 0.009 l -0.076 -0.066 l -0.006 -0.089 a 16 16 0 0 1 -1.48 -1.494 C 2.484 10.363 1.785 9.065 1.34 7.485 c -0.435 -1.548 -0.472 -3.14 0.003 -4.3 c 0.53 -1.3 1.42 -2.01 2.539 -2.3 c 0.94 -0.242 1.725 -0.254 2.659 0.008 c 0.24 0.067 0.523 0.171 0.839 0.306 q 0.23 0.1 0.477 0.214 q 0.453 0.216 0.897 0.452 l 0.246 0.134 l 0.119 -0.065 l 0.196 -0.105 q 0.41 -0.217 0.829 -0.415 q 0.245 -0.117 0.476 -0.214 q 0.41 -0.18 0.84 -0.307 Z M 10.385 12.914 l -1.238 2.574 l 0.136 -0.067 l 0.173 -0.089 l 0.093 -0.049 q 0.725 -0.387 1.41 -0.844 a 19 19 0 0 0 1.711 -1.292 Z m -2.772 0 l -2.285 0.233 q 0.82 0.696 1.712 1.291 q 0.728 0.487 1.502 0.894 l 0.173 0.089 l 0.135 0.066 Z m 1.408 -0.936 l -1.278 0.885 l 1.256 2.61 l 1.256 -2.611 Z m -4.087 -1.9 l 0.17 2.876 l 0.078 0.067 l 2.389 -0.244 l -0.45 -2.223 Z m 8.129 0 l -2.108 0.45 l -0.525 2.25 l 2.387 0.243 l 0.076 -0.067 Z m 2.74 -0.735 l -2.599 0.701 l -0.164 2.78 q 0.724 -0.653 1.364 -1.39 a 10 10 0 0 0 1.399 -2.09 Z m -13.608 0 a 10 10 0 0 0 1.4 2.092 q 0.638 0.736 1.363 1.388 l -0.165 -2.779 Z m 8.59 1.299 l -1.644 1.25 l 1.158 0.83 Z m -3.502 0.016 l 0.419 2.063 l 1.217 -0.843 Z M 7.36 4.58 l -2.395 0.901 l 0.463 2.774 l 1.795 2.184 l 1.818 1.354 l 1.804 -1.367 l 1.755 -2.276 l 0.436 -2.667 l -2.471 -0.823 l -1.49 0.863 h -0.068 Z M 5.391 8.43 l -0.443 1.507 l 2.05 0.447 Z m 7.236 -0.089 l -1.56 2.02 l 1.986 -0.425 Z M 3.563 6.927 L 2.301 9.226 l 2.511 0.678 l 0.469 -1.593 Z m 10.887 0.026 l -1.687 1.358 l 0.425 1.592 l 2.51 -0.677 Z m 2.385 -2.384 L 14.55 6.827 v 0.015 l 1.31 2.387 q 0.362 -0.753 0.617 -1.61 l 0.05 -0.171 c 0.276 -0.987 0.389 -1.989 0.308 -2.879 Z m -15.67 0 c -0.08 0.89 0.032 1.892 0.31 2.878 c 0.178 0.637 0.4 1.228 0.666 1.782 l 1.315 -2.396 Z M 13.16 5.581 l -0.42 2.57 l 1.66 -1.336 Z m -8.316 0.023 l -1.197 1.21 l 1.616 1.302 Z m -0.027 -2.413 L 1.271 4.477 l 2.271 2.244 l 1.275 -1.289 Z m 8.409 0.016 l -0.043 2.2 l 1.298 1.292 l 2.248 -2.221 Z m -4.189 0.865 l -1.495 0.451 l 1.498 0.858 l 1.354 -0.786 Z m 4.05 -0.859 l -2.36 1.353 l 2.318 0.773 Z m -8.131 -0.001 v 2.122 L 7.2 4.49 Z M 11.477 1.074 L 9.164 3.97 l 1.386 0.535 l 2.473 -1.416 Z m -4.953 0 L 4.991 3.07 l 2.383 1.357 l 1.545 -0.466 Z m -3.54 0.327 c -0.641 0.376 -1.158 0.97 -1.512 1.838 c -0.143 0.359 -0.238 0.736 -0.284 1.12 l 3.595 -1.305 Z m 12.056 0.015 l -1.795 1.648 l 3.568 1.295 a 4.6 4.6 0 0 0 -0.244 -1.017 l -0.04 -0.103 c -0.35 -0.858 -0.859 -1.447 -1.489 -1.823 Z M 11.282 1.095 q -0.275 0.092 -0.608 0.234 q -0.227 0.097 -0.472 0.213 c -0.278 0.13 -0.557 0.272 -0.823 0.412 l -0.194 0.104 l -0.151 0.083 h -0.068 l -0.093 -0.052 l -0.252 -0.135 a 20 20 0 0 0 -0.823 -0.413 a 14 14 0 0 0 -0.472 -0.212 a 9 9 0 0 0 -0.6 -0.232 l 2.32 2.797 Z M 13.96 0.99 c -0.863 -0.206 -1.595 -0.205 -2.463 0.038 l 0.1 -0.028 l 1.524 1.987 l 1.791 -1.645 a 3.6 3.6 0 0 0 -0.736 -0.296 l -0.091 -0.025 Z m -7.557 0.01 C 5.537 0.775 4.8 0.794 3.916 1.022 q -0.42 0.107 -0.804 0.308 l 1.782 1.636 Z" },
//                 count: 1,
//                 diamond_shape: { id: 1, name: "Round", drawing_path: "xxxx" },
//                 price: 10000000,
//                 status: 1
//             },
//             {
//                 id: 2,
//                 product_id: 1,
//                 diamond: {
//                     id: 1,
//                     imageUrl: "https://ion.bluenile.com/sgmdirect/photoID/35192812/Diamond/21626610/nl/Diamond-round-1-Carat_3_first_.jpg",
//                     size: 6,
//                     diamond_color: { id: 1, name: "D" },
//                     diamond_origin: { id: 1, name: "Natural" },
//                     diamond_clarity: { id: 1, name: "IF" },
//                     diamond_cut: { id: 1, name: "Excellent" },
//                     price: 10000000,
//                     deactivated: 0,
//                     created: "15/06/2024"
//                 },
//                 diamond_shape: { id: 9, name: "Heart", drawing_path: "M 11.46 0.893 c 0.934 -0.261 1.718 -0.25 2.659 -0.007 c 1.119 0.29 2.007 0.999 2.538 2.298 c 0.475 1.162 0.439 2.752 0.003 4.302 c -0.444 1.579 -1.142 2.877 -2.15 4.041 q -0.691 0.797 -1.48 1.494 l -0.006 0.089 l -0.077 0.066 l -0.084 -0.009 q -0.87 0.75 -1.827 1.389 a 17 17 0 0 1 -1.515 0.9 l -0.176 0.09 l -0.16 0.08 l -0.157 0.074 h -0.056 l -0.158 -0.075 l -0.16 -0.078 l -0.175 -0.09 l -0.093 -0.05 a 17 17 0 0 1 -1.422 -0.851 a 19 19 0 0 1 -1.827 -1.389 l -0.085 0.009 l -0.076 -0.066 l -0.006 -0.089 a 16 16 0 0 1 -1.48 -1.494 C 2.484 10.363 1.785 9.065 1.34 7.485 c -0.435 -1.548 -0.472 -3.14 0.003 -4.3 c 0.53 -1.3 1.42 -2.01 2.539 -2.3 c 0.94 -0.242 1.725 -0.254 2.659 0.008 c 0.24 0.067 0.523 0.171 0.839 0.306 q 0.23 0.1 0.477 0.214 q 0.453 0.216 0.897 0.452 l 0.246 0.134 l 0.119 -0.065 l 0.196 -0.105 q 0.41 -0.217 0.829 -0.415 q 0.245 -0.117 0.476 -0.214 q 0.41 -0.18 0.84 -0.307 Z M 10.385 12.914 l -1.238 2.574 l 0.136 -0.067 l 0.173 -0.089 l 0.093 -0.049 q 0.725 -0.387 1.41 -0.844 a 19 19 0 0 0 1.711 -1.292 Z m -2.772 0 l -2.285 0.233 q 0.82 0.696 1.712 1.291 q 0.728 0.487 1.502 0.894 l 0.173 0.089 l 0.135 0.066 Z m 1.408 -0.936 l -1.278 0.885 l 1.256 2.61 l 1.256 -2.611 Z m -4.087 -1.9 l 0.17 2.876 l 0.078 0.067 l 2.389 -0.244 l -0.45 -2.223 Z m 8.129 0 l -2.108 0.45 l -0.525 2.25 l 2.387 0.243 l 0.076 -0.067 Z m 2.74 -0.735 l -2.599 0.701 l -0.164 2.78 q 0.724 -0.653 1.364 -1.39 a 10 10 0 0 0 1.399 -2.09 Z m -13.608 0 a 10 10 0 0 0 1.4 2.092 q 0.638 0.736 1.363 1.388 l -0.165 -2.779 Z m 8.59 1.299 l -1.644 1.25 l 1.158 0.83 Z m -3.502 0.016 l 0.419 2.063 l 1.217 -0.843 Z M 7.36 4.58 l -2.395 0.901 l 0.463 2.774 l 1.795 2.184 l 1.818 1.354 l 1.804 -1.367 l 1.755 -2.276 l 0.436 -2.667 l -2.471 -0.823 l -1.49 0.863 h -0.068 Z M 5.391 8.43 l -0.443 1.507 l 2.05 0.447 Z m 7.236 -0.089 l -1.56 2.02 l 1.986 -0.425 Z M 3.563 6.927 L 2.301 9.226 l 2.511 0.678 l 0.469 -1.593 Z m 10.887 0.026 l -1.687 1.358 l 0.425 1.592 l 2.51 -0.677 Z m 2.385 -2.384 L 14.55 6.827 v 0.015 l 1.31 2.387 q 0.362 -0.753 0.617 -1.61 l 0.05 -0.171 c 0.276 -0.987 0.389 -1.989 0.308 -2.879 Z m -15.67 0 c -0.08 0.89 0.032 1.892 0.31 2.878 c 0.178 0.637 0.4 1.228 0.666 1.782 l 1.315 -2.396 Z M 13.16 5.581 l -0.42 2.57 l 1.66 -1.336 Z m -8.316 0.023 l -1.197 1.21 l 1.616 1.302 Z m -0.027 -2.413 L 1.271 4.477 l 2.271 2.244 l 1.275 -1.289 Z m 8.409 0.016 l -0.043 2.2 l 1.298 1.292 l 2.248 -2.221 Z m -4.189 0.865 l -1.495 0.451 l 1.498 0.858 l 1.354 -0.786 Z m 4.05 -0.859 l -2.36 1.353 l 2.318 0.773 Z m -8.131 -0.001 v 2.122 L 7.2 4.49 Z M 11.477 1.074 L 9.164 3.97 l 1.386 0.535 l 2.473 -1.416 Z m -4.953 0 L 4.991 3.07 l 2.383 1.357 l 1.545 -0.466 Z m -3.54 0.327 c -0.641 0.376 -1.158 0.97 -1.512 1.838 c -0.143 0.359 -0.238 0.736 -0.284 1.12 l 3.595 -1.305 Z m 12.056 0.015 l -1.795 1.648 l 3.568 1.295 a 4.6 4.6 0 0 0 -0.244 -1.017 l -0.04 -0.103 c -0.35 -0.858 -0.859 -1.447 -1.489 -1.823 Z M 11.282 1.095 q -0.275 0.092 -0.608 0.234 q -0.227 0.097 -0.472 0.213 c -0.278 0.13 -0.557 0.272 -0.823 0.412 l -0.194 0.104 l -0.151 0.083 h -0.068 l -0.093 -0.052 l -0.252 -0.135 a 20 20 0 0 0 -0.823 -0.413 a 14 14 0 0 0 -0.472 -0.212 a 9 9 0 0 0 -0.6 -0.232 l 2.32 2.797 Z M 13.96 0.99 c -0.863 -0.206 -1.595 -0.205 -2.463 0.038 l 0.1 -0.028 l 1.524 1.987 l 1.791 -1.645 a 3.6 3.6 0 0 0 -0.736 -0.296 l -0.091 -0.025 Z m -7.557 0.01 C 5.537 0.775 4.8 0.794 3.916 1.022 q -0.42 0.107 -0.804 0.308 l 1.782 1.636 Z" },
//                 count: 1,
//                 diamond_shape: { id: 1, name: "Round", drawing_path: "xxxx" },
//                 price: 8000000,
//                 status: 2
//             },
//             {
//                 id: 3,
//                 product_id: 1,
//                 diamond: {
//                     id: 2,
//                     imageUrl: "https://ion.bluenile.com/sgmdirect/photoID/35192812/Diamond/21626610/nl/Diamond-round-1-Carat_3_first_.jpg",
//                     size: 3.6,
//                     diamond_color: { id: 1, name: "D" },
//                     diamond_origin: { id: 1, name: "Natural" },
//                     diamond_clarity: { id: 1, name: "IF" },
//                     diamond_cut: { id: 1, name: "Excellent" },
//                     price: 7000000,
//                     deactivated: 0,
//                     created: "15/06/2024"
//                 },
//                 diamond_shape: { id: 1, name: "Round", drawing_path: "m 9.017 0 l 0.132 0.001 m 0 0 A 8 8 0 1 1 8.85 16 A 8 8 0 0 1 9.15 0 Z M 6.707 13.565 l -3.141 0.113 a 7.83 7.83 0 0 0 5.287 2.18 h 0.007 Z m 4.607 -0.01 l -2.142 2.303 a 7.83 7.83 0 0 0 5.284 -2.202 Z m -2.316 -0.97 l -2.169 0.904 l 2.186 2.33 l 2.172 -2.333 Z m -5.414 -2.23 l -0.101 3.184 l 3.17 -0.113 l -0.91 -2.182 Z m 10.84 -0.031 l -2.175 0.907 l -0.9 2.185 l 3.19 0.102 Z M 1.144 8.172 a 7.83 7.83 0 0 0 2.201 5.285 l 0.1 -3.143 Z m 15.714 -0.03 l -2.292 2.15 l 0.113 3.142 a 7.83 7.83 0 0 0 2.18 -5.287 Z M 5.928 11.32 l 0.85 2.037 l 2.036 -0.849 Z m 6.137 -0.013 l -2.882 1.2 l 2.041 0.841 Z M 8.98 3.538 L 5.84 4.847 L 4.543 7.994 l 1.309 3.141 l 3.147 1.297 l 3.14 -1.31 l 1.297 -3.147 l -1.309 -3.141 Z m -4.513 4.64 l -0.84 2.042 l 2.04 0.84 Z m 9.046 -0.018 l -1.188 2.886 l 2.037 -0.849 Z M 3.494 5.846 L 1.182 8.016 l 2.312 2.153 l 0.896 -2.175 Z m 10.988 -0.037 l -0.893 2.167 l 0.91 2.184 l 2.319 -2.176 Z M 3.322 2.567 a 7.83 7.83 0 0 0 -2.18 5.287 v 0.006 l 2.292 -2.151 Z m 11.333 -0.022 l -0.1 3.142 l 2.301 2.142 a 7.83 7.83 0 0 0 -2.201 -5.284 Z m -9.001 2.38 l -2.037 0.848 l 0.849 2.037 Z m 6.658 -0.015 l 1.2 2.881 l 0.84 -2.04 Z m -8.85 -2.427 l 0.112 3.155 l 2.157 -0.899 l 0.887 -2.156 Z m 11.055 -0.022 l -3.178 0.113 l 0.896 2.152 l 2.182 0.899 Z m -7.762 0.16 l -0.84 2.041 l 2.881 -1.2 Z m 4.447 -0.008 l -2.036 0.849 l 2.886 1.188 Z M 8.984 0.182 L 6.828 2.499 l 2.153 0.887 l 2.164 -0.902 Z m -0.156 -0.039 a 7.83 7.83 0 0 0 -5.284 2.202 l 3.142 0.1 Z m 0.319 0 H 9.14 l 2.151 2.292 l 3.142 -0.113 a 7.83 7.83 0 0 0 -5.287 -2.18 Z" },
//                 count: 4,
//                 diamond_shape: { id: 1, name: "Round", drawing_path: "xxxx" },
//                 price: 28000000,
//                 status: 1
//             },
//             {
//                 id: 4,
//                 product_id: 1,
//                 diamond: {
//                     id: 2,
//                     imageUrl: "https://ion.bluenile.com/sgmdirect/photoID/35192812/Diamond/21626610/nl/Diamond-round-1-Carat_3_first_.jpg",
//                     size: 3.6,
//                     diamond_color: { id: 1, name: "D" },
//                     diamond_origin: { id: 1, name: "Natural" },
//                     diamond_clarity: { id: 1, name: "IF" },
//                     diamond_cut: { id: 1, name: "Excellent" },
//                     price: 6000000,
//                     deactivated: 0,
//                     created: "15/06/2024"
//                 },
//                 diamond_shape: { id: 1, name: "Round", drawing_path: "m 9.017 0 l 0.132 0.001 m 0 0 A 8 8 0 1 1 8.85 16 A 8 8 0 0 1 9.15 0 Z M 6.707 13.565 l -3.141 0.113 a 7.83 7.83 0 0 0 5.287 2.18 h 0.007 Z m 4.607 -0.01 l -2.142 2.303 a 7.83 7.83 0 0 0 5.284 -2.202 Z m -2.316 -0.97 l -2.169 0.904 l 2.186 2.33 l 2.172 -2.333 Z m -5.414 -2.23 l -0.101 3.184 l 3.17 -0.113 l -0.91 -2.182 Z m 10.84 -0.031 l -2.175 0.907 l -0.9 2.185 l 3.19 0.102 Z M 1.144 8.172 a 7.83 7.83 0 0 0 2.201 5.285 l 0.1 -3.143 Z m 15.714 -0.03 l -2.292 2.15 l 0.113 3.142 a 7.83 7.83 0 0 0 2.18 -5.287 Z M 5.928 11.32 l 0.85 2.037 l 2.036 -0.849 Z m 6.137 -0.013 l -2.882 1.2 l 2.041 0.841 Z M 8.98 3.538 L 5.84 4.847 L 4.543 7.994 l 1.309 3.141 l 3.147 1.297 l 3.14 -1.31 l 1.297 -3.147 l -1.309 -3.141 Z m -4.513 4.64 l -0.84 2.042 l 2.04 0.84 Z m 9.046 -0.018 l -1.188 2.886 l 2.037 -0.849 Z M 3.494 5.846 L 1.182 8.016 l 2.312 2.153 l 0.896 -2.175 Z m 10.988 -0.037 l -0.893 2.167 l 0.91 2.184 l 2.319 -2.176 Z M 3.322 2.567 a 7.83 7.83 0 0 0 -2.18 5.287 v 0.006 l 2.292 -2.151 Z m 11.333 -0.022 l -0.1 3.142 l 2.301 2.142 a 7.83 7.83 0 0 0 -2.201 -5.284 Z m -9.001 2.38 l -2.037 0.848 l 0.849 2.037 Z m 6.658 -0.015 l 1.2 2.881 l 0.84 -2.04 Z m -8.85 -2.427 l 0.112 3.155 l 2.157 -0.899 l 0.887 -2.156 Z m 11.055 -0.022 l -3.178 0.113 l 0.896 2.152 l 2.182 0.899 Z m -7.762 0.16 l -0.84 2.041 l 2.881 -1.2 Z m 4.447 -0.008 l -2.036 0.849 l 2.886 1.188 Z M 8.984 0.182 L 6.828 2.499 l 2.153 0.887 l 2.164 -0.902 Z m -0.156 -0.039 a 7.83 7.83 0 0 0 -5.284 2.202 l 3.142 0.1 Z m 0.319 0 H 9.14 l 2.151 2.292 l 3.142 -0.113 a 7.83 7.83 0 0 0 -5.287 -2.18 Z" },
//                 count: 4,
//                 diamond_shape: { id: 1, name: "Round", drawing_path: "xxxx" },
//                 price: 24000000,
//                 status: 2
//             }
//         ],
//         product_metal: [
//             {
//                 product_id: 1,
//                 metal: {
//                     id: 1,
//                     name: "Silver",
//                     buy_price_per_gram: 700000,
//                     sale_price_per_gram: 800000,
//                     imageUrl: silver,
//                     specific_weight: 10.49,
//                     deactivated: 0,
//                     created: "12/03/2023"
//                 },
//                 volume: 3.0,
//                 weight: 31.47,
//                 status: 1,
//                 price: 25176000
//             },
//             {
//                 product_id: 1,
//                 metal: {
//                     id: 3,
//                     name: "18K Gold",
//                     buy_price_per_gram: 7000000,
//                     sale_price_per_gram: 7500000,
//                     imageUrl: gold,
//                     specific_weight: 15.6,
//                     deactivated: 0,
//                     created: "12/03/2023"
//                 },
//                 volume: 1,
//                 weight: 15.6,
//                 status: 1,
//                 price: 117000000
//             },
//             {
//                 product_id: 1,
//                 metal: {
//                     id: 1,
//                     name: "Silver",
//                     buy_price_per_gram: 700000,
//                     sale_price_per_gram: 800000,
//                     imageUrl: silver,
//                     specific_weight: 10.49,
//                     deactivated: 0,
//                     created: "12/03/2023"
//                 },
//                 volume: 3.0,
//                 weight: 31.47,
//                 status: 2,
//                 price: 25176000
//             },
//             {
//                 product_id: 1,
//                 metal: {
//                     id: 3,
//                     name: "18K Gold",
//                     buy_price_per_gram: 7000000,
//                     sale_price_per_gram: 7500000,
//                     imageUrl: gold,
//                     specific_weight: 15.6,
//                     deactivated: 0,
//                     created: "12/03/2023"
//                 },
//                 volume: 1,
//                 weight: 15.6,
//                 status: 2,
//                 price: 117000000
//             }
//         ]
//     },
//     account: {
//         id: 1,
//         username: "lockthepoet000",
//         image_Url: "xxxx",
//         dob: "10/03/2004",
//         email: "lochmse182366@fpt.edu.vn",
//         fullname: "Hoàng Minh Lộc",
//         role: { id: 4, name: "Customer" },
//         phone: "0987654321",
//         address: "Hà Nội",
//         deactivated: false,
//         deactivated_date: null,
//     },
//     order_status: { id: 5, name: "Delivery" },
//     order_type: { id: 1, name: "Customization" },
//     deposit_has_paid: 100000000,
//     product_price: 18017600000,
//     profit_rate: 0.2,
//     production_price: 5000000,
//     total_price: (18022600000 + 5000000) * 1.2,
//     note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
//     sale_staff: {
//         id: 1,
//         username: "salestaff",
//         image_Url: "https://i.pinimg.com/564x/b6/b7/44/b6b744d0daf9801934df73466939c520.jpg",
//         dob: "10/03/2004",
//         email: "salestaff@gmail.com",
//         fullname: "Sale Staff",
//         role: { id: 2, name: "Sale Staff" },
//         phone: "0987654321",
//         address: "Hà Nội",
//         order_count: 12,
//         deactivated: false,
//         deactivated_date: null
//     },
//     design_staff: {
//         id: 1,
//         username: "designstaff",
//         image_Url: "https://i.pinimg.com/564x/2e/56/d6/2e56d67bf952b7ea61d04b278c51bf72.jpg",
//         dob: "10/03/2004",
//         email: "designstaff@gmail.com",
//         fullname: "Design Staff",
//         role: { id: 3, name: "Design Staff" },
//         phone: "0987654321",
//         address: "Hà Nội",
//         order_count: 12,
//         deactivated: false,
//         deactivated_date: null
//     },
//     production_staff: {
//         id: 1,
//         username: "productionstaff",
//         image_Url: "https://i.pinimg.com/564x/5d/d9/a7/5dd9a7fc0a9b2395acfd197ec30b5f2c.jpg",
//         dob: "10/03/2004",
//         email: "productionstaff@gmail.com",
//         fullname: "Production Staff",
//         role: { id: 4, name: "Production Staff" },
//         phone: "0987654321",
//         address: "Hà Nội",
//         order_count: 12,
//         deactivated: false,
//         deactivated_date: null
//     },
//     created_date: "15/06/2024",
//     design_process: {
//         id: 1,
//         order_id: 1,
//         imageUrl: "https://i.pinimg.com/564x/82/9c/70/829c70989bfed3899a3e3d248f7664fe.jpg",
//         note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
//         mounting_type: { id: 1, name: "Ring" },
//         mounting_size: 7,
//         design_process_status: null,
//         production_price: 50000000,
//         profit_rate: 0.3,
//         total_price: 65000000,
//         product_price: 15000000,
//         created: "15/06/2024"
//     }
// }

export default function OrderDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [orderDetail, setOrderDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkContent, setCheckContent] = useState("order-informations");
    
    //call api để lấy order_detail từ id
    useEffect(() => {
        const setAttribute = async () => {
            const formData = new FormData();
            formData.append("order_id", id);
            const order_detail_data = await get_order_detail_customer(formData, 'Get order detail', true);
            const order_detail = order_detail_data.data.order_detail;
            setOrderDetail(order_detail);
            console.log('DETAIL', order_detail);
            setLoading(false);
        }

        setAttribute()
    }, []);



    const handleBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    const handleChangeContent = (content) => {
        setCheckContent(content);
    }


    return (
        <div className="flex flex-col items-center">
            <div className="flex w-full">
                <div className="w-1/5 flex items-center underline">
                    <IoMdArrowDropleft size={20} />
                    <button onClick={handleBack}>Back to Order list</button>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <h1 className="font-loraFont text-4xl font-light">Order Details</h1>
                </div>
                <div className="w-1/5">

                </div>
            </div>
            <div className="w-10/12 my-7">
                {!loading && <OrderStepper order={orderDetail} />}
            </div>
            {!loading &&
                <div className="w-10/12 grid grid-cols-3">
                    <div className="w-full flex items-center justify-center">
                        <button onClick={() => handleChangeContent("order-informations")} className="w-[190px] h-[40px] bg-[#151542] text-white font-semibold hover:bg-[#2323D5] hover:text-yellow-400">Order Informations</button>
                    </div>
                    {orderDetail.order_type.id == 2 &&
                        <div className="w-full flex items-center justify-center">
                            <button onClick={() => handleChangeContent("design-process")} className="w-[190px] h-[40px] bg-[#151542] text-white font-semibold hover:bg-[#2323D5] hover:text-yellow-400">Design Process</button>
                        </div>
                    }
                    <div className="w-full flex items-center justify-center">
                        <button onClick={() => handleChangeContent("manufacture-progress")} className="w-[190px] h-[40px] bg-[#151542] text-white font-semibold hover:bg-[#2323D5] hover:text-yellow-400">Manufacture Progress</button>
                    </div>
                </div>
            }
            <div className="w-10/12 h-0.5 my-5 bg-gray-500"></div>

            <div className="w-10/12">
                {!loading && checkContent === "order-informations" && (
                    <OrderInformations order={orderDetail} />
                )}
                {!loading && checkContent === "design-process" && (
                    orderDetail.order_status.id !== 1 && orderDetail.design_process !== null && orderDetail.design_process.design_process_status.id == 3 ? (
                        <DesignProcess order={orderDetail} />
                    ) : (
                        <div className="flex justify-center">
                            <p className="font-loraFont font-light text-xl text-[#151542]">Đơn hàng của bạn chưa tới bước Design, vui lòng đợi trong tương lai.</p>
                        </div>
                    )
                )}
                {!loading && checkContent === "manufacture-progress" && (
                    orderDetail.order_status.id !== 1 && orderDetail.order_status.id !== 2 ? (
                        <ManufactureProgress order={orderDetail} />
                    ) : (
                        <div className="flex justify-center">
                            <p className="font-loraFont font-light text-xl text-[#151542]">Đơn hàng của bạn chưa tới bước Manufacture, vui lòng đợi trong tương lai.</p>
                        </div>
                    )
                )}
            </div>

        </div>
    );
}