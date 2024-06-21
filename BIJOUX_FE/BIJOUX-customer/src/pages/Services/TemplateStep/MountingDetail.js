import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { gold, silver, platinum, roseGold } from "../../../assets/images/index";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import numeral from 'numeral';
import { CSpinner } from "@coreui/react";
import Swal from "sweetalert2";
import { get_model_detail } from "../../../api/main/items/Model_api";
import { get_metal_compatibility } from "../../../api/main/items/Metal_api";




const model_data =
{
    id: 2,
    name: "French Pavé Diamond Engagement Ring In 14k White Gold (1/4 Ct. Tw.)",
    imageUrl: "https://ion.bluenile.com/sets/Jewelry-bn/195314/RND/Images/gallery.jpg",
    mounting_type: { id: 2, name: 'Pendant', min_size: 4, max_size: 11 },
    base_width: 20,
    base_height: 15,
    volume: null,
    production_price: 200,
    profit_rate: 0.3,
    model_diamond_shape: [
        {
            id: 1,
            name: "Round",
            drawingPath: "m 8.817 1 l 0.132 0.001 m 0 0 A 8 8 0 1 1 8.65 17 A 8 8 0 0 1 8.95 1 Z M 6.507 14.565 l -3.141 0.113 a 7.83 7.83 0 0 0 5.287 2.18 h 0.007 Z m 4.607 -0.01 l -2.142 2.303 a 7.83 7.83 0 0 0 5.284 -2.202 Z m -2.316 -0.97 l -2.169 0.904 l 2.186 2.33 l 2.172 -2.333 Z m -5.414 -2.23 l -0.101 3.184 l 3.17 -0.113 l -0.91 -2.182 Z m 10.84 -0.031 l -2.175 0.907 l -0.9 2.185 l 3.19 0.102 Z M 0.944 9.172 a 7.83 7.83 0 0 0 2.201 5.285 l 0.1 -3.143 Z m 15.714 -0.03 l -2.292 2.15 l 0.113 3.142 a 7.83 7.83 0 0 0 2.18 -5.287 Z M 5.728 12.32 l 0.85 2.037 l 2.036 -0.849 Z m 6.137 -0.013 l -2.882 1.2 l 2.041 0.841 Z M 8.78 4.538 L 5.64 5.847 L 4.343 8.994 l 1.309 3.141 l 3.147 1.297 l 3.14 -1.31 l 1.297 -3.147 l -1.309 -3.141 Z m -4.513 4.64 l -0.84 2.042 l 2.04 0.84 Z m 9.046 -0.018 l -1.188 2.886 l 2.037 -0.849 Z M 3.294 6.846 L 0.982 9.016 l 2.312 2.153 l 0.896 -2.175 Z m 10.988 -0.037 l -0.893 2.167 l 0.91 2.184 l 2.319 -2.176 Z M 3.122 3.567 a 7.83 7.83 0 0 0 -2.18 5.287 v 0.006 l 2.292 -2.151 Z m 11.333 -0.022 l -0.1 3.142 l 2.301 2.142 a 7.83 7.83 0 0 0 -2.201 -5.284 Z m -9.001 2.38 l -2.037 0.848 l 0.849 2.037 Z m 6.658 -0.015 l 1.2 2.881 l 0.84 -2.04 Z m -8.85 -2.427 l 0.112 3.155 l 2.157 -0.899 l 0.887 -2.156 Z m 11.055 -0.022 l -3.178 0.113 l 0.896 2.152 l 2.182 0.899 Z m -7.762 0.16 l -0.84 2.041 l 2.881 -1.2 Z m 4.447 -0.008 l -2.036 0.849 l 2.886 1.188 Z M 8.784 1.182 L 6.628 3.499 l 2.153 0.887 l 2.164 -0.902 Z m -0.156 -0.039 a 7.83 7.83 0 0 0 -5.284 2.202 l 3.142 0.1 Z m 0.319 0 H 8.94 l 2.151 2.292 l 3.142 -0.113 a 7.83 7.83 0 0 0 -5.287 -2.18 Z"
        },
        {
            id: 2,
            name: "Oval",
            drawingPath: "M 6.1 1.001 c 2.95 0.083 5.287 3.735 5.233 8.148 S 8.852 17.08 5.9 16.999 S 0.614 13.265 0.668 8.85 S 3.148 0.92 6.1 1.001 Z M 9.559 14.73 H 7.542 l -1.406 2.128 c 1.32 -0.051 2.52 -0.848 3.423 -2.128 Z m -5.099 0 H 2.441 c 0.908 1.288 2.122 2.09 3.462 2.129 l -0.039 -0.002 L 4.46 14.73 Z M 6 13.78 l -1.413 0.896 l 1.414 2.139 l 1.412 -2.14 Z m 3.613 -2.292 l -1.432 0.909 l -0.59 2.19 h 2.022 Z m -7.225 0 v 3.099 h 2.02 l -0.588 -2.19 Z m 1.599 1.015 l 0.55 2.042 l 1.333 -0.847 Z m 4.026 0 L 6.13 13.698 l 1.334 0.847 Z M 0.801 9.192 c 0.032 2.037 0.58 3.887 1.454 5.258 v -3.058 Z m 10.398 0 l -1.453 2.2 v 3.058 c 0.878 -1.377 1.428 -3.24 1.454 -5.303 Z m -5.2 -4.824 L 3.926 5.664 L 3.038 8.97 l 0.896 3.334 L 6 13.617 l 2.067 -1.312 l 0.896 -3.333 l -0.887 -3.308 Z m -3.03 4.86 l -0.566 2.107 l 1.364 0.865 Z m 6.063 0.002 l -0.798 2.969 l 1.363 -0.864 Z M 2.298 6.735 L 0.813 8.963 l 1.485 2.249 l 0.601 -2.24 Z m 7.405 0 L 9.1 8.973 l 0.601 2.24 l 1.486 -2.249 Z m 0.042 -3.185 v 3.006 l 1.453 2.178 c -0.044 -2.007 -0.588 -3.83 -1.453 -5.184 Z m -7.49 0 C 1.377 4.927 0.827 6.79 0.8 8.854 l 0.002 -0.12 l 1.452 -2.178 Z m 1.504 2.217 l -1.355 0.847 l 0.564 2.1 Z m 4.482 0 l 0.79 2.947 l 0.566 -2.1 Z m -3.85 -2.355 H 2.388 V 6.46 l 1.424 -0.889 Z m 5.222 0 H 7.609 l 0.58 2.16 l 1.424 0.888 Z m -5.092 0.032 l -0.544 2.023 L 5.87 4.286 Z m 2.959 0 l -1.349 0.841 l 1.892 1.182 Z M 6 1.184 L 4.578 3.316 L 6 4.204 l 1.422 -0.888 Z m 0.137 -0.04 L 7.556 3.27 h 2.003 C 8.65 1.983 7.437 1.18 6.097 1.143 Z m -0.273 0 c -1.318 0.05 -2.52 0.848 -3.422 2.127 h 2.003 l 1.419 -2.128 Z"
        },
        {
            id: 3,
            name: "Princess",
            drawingPath: "M 16.322 1 c 0.043 0 0.077 0.035 0.077 0.077 v 15.846 a 0.077 0.077 0 0 1 -0.077 0.077 H 0.476 a 0.077 0.077 0 0 1 -0.077 -0.077 V 1.077 C 0.4 1.035 0.434 1 0.476 1 Z m -2.258 13.775 H 2.734 l -2.07 2.07 h 15.471 l -2.07 -2.07 Z M 0.554 1.263 v 15.474 l 2.07 -2.072 V 3.335 Z m 15.69 0.001 l -2.07 2.07 v 11.332 l 2.07 2.07 Z m -4.58 11.11 h -6.53 L 2.888 14.62 H 13.91 l -2.247 -2.247 Z M 2.779 3.488 v 11.023 l 2.246 -2.247 V 5.736 Z m 11.24 0 l -2.247 2.248 v 6.527 l 2.248 2.248 Z m -2.4 2.293 h -6.44 v 6.438 h 6.439 Z m 2.292 -2.402 H 2.888 l 2.247 2.247 h 6.528 Z m 2.225 -2.225 H 0.663 l 2.07 2.071 h 11.332 Z"
        },
        {
            id: 4,
            name: "Heart",
            drawingPath: "M 10.66 0.693 c 0.934 -0.261 1.718 -0.25 2.659 -0.007 c 1.119 0.29 2.007 0.999 2.538 2.298 c 0.475 1.162 0.439 2.752 0.003 4.302 c -0.444 1.579 -1.142 2.877 -2.15 4.041 q -0.691 0.797 -1.48 1.494 l -0.006 0.089 l -0.077 0.066 l -0.084 -0.009 q -0.87 0.75 -1.827 1.389 a 17 17 0 0 1 -1.515 0.9 l -0.176 0.09 l -0.16 0.08 l -0.157 0.074 h -0.056 l -0.158 -0.075 l -0.16 -0.078 l -0.175 -0.09 l -0.093 -0.05 a 17 17 0 0 1 -1.422 -0.851 a 19 19 0 0 1 -1.827 -1.389 l -0.085 0.009 l -0.076 -0.066 l -0.006 -0.089 a 16 16 0 0 1 -1.48 -1.494 C 1.684 10.163 0.985 8.865 0.54 7.285 c -0.435 -1.548 -0.472 -3.14 0.003 -4.3 c 0.53 -1.3 1.42 -2.01 2.539 -2.3 c 0.94 -0.242 1.725 -0.254 2.659 0.008 c 0.24 0.067 0.523 0.171 0.839 0.306 q 0.23 0.1 0.477 0.214 q 0.453 0.216 0.897 0.452 l 0.246 0.134 l 0.119 -0.065 l 0.196 -0.105 q 0.41 -0.217 0.829 -0.415 q 0.245 -0.117 0.476 -0.214 q 0.41 -0.18 0.84 -0.307 Z M 9.585 12.714 l -1.238 2.574 l 0.136 -0.067 l 0.173 -0.089 l 0.093 -0.049 q 0.725 -0.387 1.41 -0.844 a 19 19 0 0 0 1.711 -1.292 Z m -2.772 0 l -2.285 0.233 q 0.82 0.696 1.712 1.291 q 0.728 0.487 1.502 0.894 l 0.173 0.089 l 0.135 0.066 Z m 1.408 -0.936 l -1.278 0.885 l 1.256 2.61 l 1.256 -2.611 Z m -4.087 -1.9 l 0.17 2.876 l 0.078 0.067 l 2.389 -0.244 l -0.45 -2.223 Z m 8.129 0 l -2.108 0.45 l -0.525 2.25 l 2.387 0.243 l 0.076 -0.067 Z m 2.74 -0.735 l -2.599 0.701 l -0.164 2.78 q 0.724 -0.653 1.364 -1.39 a 10 10 0 0 0 1.399 -2.09 Z m -13.608 0 a 10 10 0 0 0 1.4 2.092 q 0.638 0.736 1.363 1.388 l -0.165 -2.779 Z m 8.59 1.299 l -1.644 1.25 l 1.158 0.83 Z m -3.502 0.016 l 0.419 2.063 l 1.217 -0.843 Z M 6.56 4.38 l -2.395 0.901 l 0.463 2.774 l 1.795 2.184 l 1.818 1.354 l 1.804 -1.367 l 1.755 -2.276 l 0.436 -2.667 l -2.471 -0.823 l -1.49 0.863 h -0.068 Z M 4.591 8.23 l -0.443 1.507 l 2.05 0.447 Z m 7.236 -0.089 l -1.56 2.02 l 1.986 -0.425 Z M 2.763 6.727 L 1.501 9.026 l 2.511 0.678 l 0.469 -1.593 Z m 10.887 0.026 l -1.687 1.358 l 0.425 1.592 l 2.51 -0.677 Z m 2.385 -2.384 L 13.75 6.627 v 0.015 l 1.31 2.387 q 0.362 -0.753 0.617 -1.61 l 0.05 -0.171 c 0.276 -0.987 0.389 -1.989 0.308 -2.879 Z m -15.67 0 c -0.08 0.89 0.032 1.892 0.31 2.878 c 0.178 0.637 0.4 1.228 0.666 1.782 l 1.315 -2.396 Z M 12.36 5.381 l -0.42 2.57 l 1.66 -1.336 Z m -8.316 0.023 l -1.197 1.21 l 1.616 1.302 Z m -0.027 -2.413 L 0.471 4.277 l 2.271 2.244 l 1.275 -1.289 Z m 8.409 0.016 l -0.043 2.2 l 1.298 1.292 l 2.248 -2.221 Z m -4.189 0.865 l -1.495 0.451 l 1.498 0.858 l 1.354 -0.786 Z m 4.05 -0.859 l -2.36 1.353 l 2.318 0.773 Z m -8.131 -0.001 v 2.122 L 6.4 4.29 Z M 10.677 0.874 L 8.364 3.77 l 1.386 0.535 l 2.473 -1.416 Z m -4.953 0 L 4.191 2.87 l 2.383 1.357 l 1.545 -0.466 Z m -3.54 0.327 c -0.641 0.376 -1.158 0.97 -1.512 1.838 c -0.143 0.359 -0.238 0.736 -0.284 1.12 l 3.595 -1.305 Z m 12.056 0.015 l -1.795 1.648 l 3.568 1.295 a 4.6 4.6 0 0 0 -0.244 -1.017 l -0.04 -0.103 c -0.35 -0.858 -0.859 -1.447 -1.489 -1.823 Z M 10.482 0.895 q -0.275 0.092 -0.608 0.234 q -0.227 0.097 -0.472 0.213 c -0.278 0.13 -0.557 0.272 -0.823 0.412 l -0.194 0.104 l -0.151 0.083 h -0.068 l -0.093 -0.052 l -0.252 -0.135 a 20 20 0 0 0 -0.823 -0.413 a 14 14 0 0 0 -0.472 -0.212 a 9 9 0 0 0 -0.6 -0.232 l 2.32 2.797 Z M 13.16 0.79 c -0.863 -0.206 -1.595 -0.205 -2.463 0.038 l 0.1 -0.028 l 1.524 1.987 l 1.791 -1.645 a 3.6 3.6 0 0 0 -0.736 -0.296 l -0.091 -0.025 Z m -7.557 0.01 C 4.737 0.575 4 0.594 3.116 0.822 q -0.42 0.107 -0.804 0.308 l 1.782 1.636 Z"
        },
        {
            id: 5,
            name: "Cushion",
            drawingPath: "M 9.398 1 c 0.95 0.003 1.737 0.068 2.904 0.286 C 15.52 1.887 17.2 3.7 17.2 7.141 v 3.718 c 0 3.442 -1.68 5.253 -4.898 5.855 A 17 17 0 0 1 9.198 17 h -0.195 c -0.95 -0.003 -1.737 -0.068 -2.904 -0.286 C 2.88 16.113 1.2 14.301 1.2 10.858 V 7.141 c 0 -3.442 1.68 -5.254 4.899 -5.855 A 17 17 0 0 1 9.203 1 Z M 6.93 14.579 l -4.022 0.542 c 0.693 0.64 1.616 1.083 2.763 1.352 l 0.225 0.05 q 0.113 0.024 0.23 0.046 c 1.157 0.217 1.936 0.28 2.877 0.283 h 0.048 Z m 4.562 -0.01 l -2.12 2.282 h 0.03 c 0.885 -0.01 1.769 -0.091 2.642 -0.24 l 0.23 -0.042 q 0.117 -0.021 0.23 -0.046 l 0.226 -0.05 c 1.169 -0.275 2.105 -0.729 2.804 -1.39 Z M 9.21 12.316 l -2.13 2.206 l 2.13 2.286 l 2.131 -2.295 Z m -5.397 -0.924 l -0.923 3.582 l 3.955 -0.533 l -0.89 -2.215 Z M 1.348 9.099 v 1.76 c 0 1.81 0.47 3.154 1.394 4.1 l 0.932 -3.62 l -0.061 -0.023 l -0.02 -0.099 Z m 15.704 -0.032 l -2.235 2.125 l -0.02 0.102 l -0.062 0.024 l 0.934 3.632 c 0.894 -0.923 1.36 -2.223 1.382 -3.961 V 9.066 Z m -2.456 2.306 l -2.152 0.854 l -0.869 2.205 l 3.935 0.5 Z m -5.511 0.862 H 6.119 l 0.871 2.168 Z m 3.197 0 H 9.338 l 2.093 2.158 Z m 0.025 -6.32 H 6.092 v 6.172 h 6.215 Z M 5.944 9.14 L 3.793 11.2 l 0.025 0.024 l 0.004 0.012 l 2.122 0.827 Z m 6.512 -0.022 v 2.943 l 2.131 -0.845 l 0.004 -0.015 l 0.025 -0.023 Z M 3.657 6.91 L 1.46 9 l 2.226 2.1 l 2.178 -2.086 Z m 11.078 -0.023 l -2.2 2.105 l 2.187 2.085 l 2.218 -2.109 Z M 2.729 3.054 C 1.814 4 1.348 5.34 1.348 7.14 v 1.76 l 2.244 -2.134 l 0.01 -0.053 l 0.071 -0.03 Z m 3.215 2.888 l -2.178 0.864 l -0.001 0.001 l 2.18 2.078 Z m 9.63 -2.986 l -0.859 3.707 l 0.073 0.028 l 0.01 0.052 l 2.254 2.126 V 7.141 c 0 -1.864 -0.499 -3.234 -1.478 -4.185 Z m -3.118 2.986 v 2.921 l 2.17 -2.077 Z M 2.89 3.084 l 0.923 3.545 l 2.142 -0.85 l 0.884 -2.24 Z m 12.532 -0.13 l -3.883 0.573 l 0.906 2.252 l 2.13 0.829 Z m -8.453 0.66 L 6.12 5.765 h 2.936 Z m 4.44 -0.01 L 9.322 5.766 h 2.959 Z M 9.196 1.19 L 7.04 3.475 L 9.188 5.69 l 2.15 -2.224 l -2.145 -2.274 Z m -0.163 -0.042 c -0.975 0.01 -1.947 0.105 -2.905 0.282 c -1.392 0.26 -2.487 0.747 -3.275 1.5 l 4.056 0.468 Z m 0.366 -0.001 h -0.042 l 2.114 2.24 l 3.942 -0.582 c -0.776 -0.682 -1.824 -1.13 -3.137 -1.375 c -1.158 -0.217 -1.935 -0.28 -2.877 -0.283 Z"
        },
        {
            id: 6,
            name: "Pear",
            drawingPath: "m 10.861 5.176 l -0.025 -0.13 v -0.002 l -0.022 -0.1 C 10.286 2.66 8.121 1 5.601 1 S 0.916 2.66 0.388 4.938 l -0.021 0.096 l -0.032 0.17 a 5 5 0 0 0 -0.066 0.657 L 0.267 6 l 0.004 0.268 c 0.032 1.216 0.277 2.476 0.732 3.75 l 0.064 0.177 l 0.093 0.242 c 0.416 1.06 0.975 2.13 1.663 3.183 l -0.005 -0.009 l 0.02 0.032 l 0.15 0.226 a 21 21 0 0 0 1.817 2.326 l 0.17 0.185 l 0.08 0.087 l 0.156 0.163 l 0.164 0.165 l 0.047 0.046 l 0.035 0.03 c 0.03 0.026 0.05 0.036 0.073 0.042 V 17 h 0.141 v -0.092 a 0.25 0.25 0 0 0 0.09 -0.052 l 0.226 -0.226 l 0.154 -0.16 l 0.161 -0.174 a 21 21 0 0 0 1.983 -2.534 l 0.061 -0.093 l 0.03 -0.044 l -0.006 0.005 l 0.137 -0.212 a 17.2 17.2 0 0 0 1.616 -3.194 l 0.011 -0.03 l 0.134 -0.382 c 0.41 -1.202 0.632 -2.393 0.661 -3.546 l 0.003 -0.185 l 0.002 -0.016 l -0.002 -0.204 a 5 5 0 0 0 -0.07 -0.685 Z m 0 0 l 0.016 0.092 q 0.005 0.013 0.004 0.028 Z m -5.19 -1.633 l 3.446 -1.115 a 5.38 5.38 0 0 0 -3.446 -1.285 Z m -0.14 0 v -2.4 h -0.035 a 5.38 5.38 0 0 0 -3.411 1.285 Z M 0.477 5.202 l 3.368 -0.771 l -1.9 -1.879 A 4.76 4.76 0 0 0 0.526 4.97 L 0.5 5.078 Z m 10.244 -0.01 l -0.026 -0.13 a 4.76 4.76 0 0 0 -1.44 -2.51 L 7.358 4.432 l 3.365 0.77 Z M 7.2 4.388 L 8.985 2.62 L 5.783 3.657 l 1.417 0.73 Z m -3.197 -0.001 l 1.417 -0.731 l -3.202 -1.035 Z m 1.668 7.562 l 1.423 -1.68 l 0.87 -3.75 l -0.807 -1.994 l -1.486 -0.767 Z m -0.14 -0.001 V 3.759 l -1.485 0.766 l -0.81 1.994 l 0.871 3.75 Z M 8.076 6.42 l 2.51 -1.105 l -3.26 -0.746 Z m -4.952 0 l 0.75 -1.85 l -3.258 0.745 Z m -2.04 3.402 l 1.972 -3.276 l -2.61 -1.15 q -0.028 0.222 -0.037 0.447 l -0.002 0.192 v 0.037 c 0.01 1.198 0.23 2.439 0.66 3.699 Z m 9.032 -0.002 l -0.052 0.146 c 0.45 -1.259 0.694 -2.503 0.724 -3.705 l 0.003 -0.19 l 0.001 -0.037 V 6 q 0 -0.3 -0.04 -0.602 l -2.607 1.15 Z m -2.868 0.402 l 2.765 -0.299 l -1.945 -3.232 l -0.82 3.53 Z m -3.297 0 l -0.82 -3.529 l -1.942 3.23 Z m -0.948 3.416 l 0.945 -3.274 l -2.779 -0.3 l 0.005 0.012 l 0.035 0.096 a 17 17 0 0 0 1.583 3.14 l 0.179 0.278 Z m 5.195 -0.003 l 0.064 -0.097 l 0.134 -0.207 a 17.4 17.4 0 0 0 1.514 -2.949 l 0.08 -0.21 l 0.04 -0.107 l -2.777 0.3 Z m -0.157 -0.035 l -0.912 -3.156 l -1.424 1.681 Z m -4.88 0 l 2.334 -1.475 l -1.424 -1.68 Z m 2.509 3.147 l 0.216 -0.217 l 0.152 -0.16 l 0.079 -0.083 l 0.164 -0.18 l 0.172 -0.193 a 21 21 0 0 0 1.564 -2.01 l 0.072 -0.107 l -2.42 -1.527 Z m -0.14 -0.001 v -4.473 L 3.11 13.8 a 21 21 0 0 0 1.622 2.1 l 0.176 0.198 q 0.086 0.095 0.168 0.183 l 0.159 0.17 l 0.196 0.2 l 0.087 0.085 l 0.01 0.011 Z"
        }
    ],
    model_diamond: [
        {
            diamond_size_min: 3.6,
            diamond_size_max: 6,
            count: 1,
            diamond_shape: [
                {
                    id: 1,
                    name: "Round",
                    drawingPath: ""
                }
            ],
            is_editable: 1
        },
        {
            diamond_size_min: 2,
            diamond_size_max: 2,
            count: 4,
            diamond_shape: [
                {
                    id: 1,
                    name: "Round",
                    drawingPath: ""
                }
            ],
            is_editable: 0
        }
    ],
    model_metal: [
        {
            metal: {
                id: 1,
                name: "Silver",
                buy_price_per_gram: 1800,
                sale_price_per_gram: 2200,
                imageUrl: 'http://127.0.0.1:8000/image/Metal/1/main.jpg',
                specific_weight: 20,
                deactivated: 0,
                created: "20/11/2022"
            },

            is_main: 1,
            percentage: 0.8
        },
        {
            metal: {
                id: 2,
                name: "Gold",
                buy_price_per_gram: 1800,
                sale_price_per_gram: 2200,
                imageUrl: 'http://127.0.0.1:8000/image/Metal/1/main.jpg',
                specific_weight: 20,
                deactivated: 0,
                created: "20/11/2022"
            },

            is_main: 1,
            percentage: 0.8
        },
        {
            metal: {
                id: 3,
                name: "Platinum",
                buy_price_per_gram: 1800,
                sale_price_per_gram: 2200,
                imageUrl: 'http://127.0.0.1:8000/image/Metal/1/main.jpg',
                specific_weight: 20,
                deactivated: 0,
                created: "20/11/2022"
            }
            ,
            is_main: 1,
            percentage: 0.8
        },
        {
            metal: {
                id: 4,
                name: "Rose-Gold",
                buy_price_per_gram: 1800,
                sale_price_per_gram: 2200,
                imageUrl: 'http://127.0.0.1:8000/image/Metal/1/main.jpg',
                specific_weight: 20,
                deactivated: 0,
                created: "20/11/2022"
            },
            is_main: 1,
            percentage: 0.8
        },
        // {
        //     metal: {
        //         id: 1,
        //         name: "Silver",
        //         buy_price_per_gram: 1800,
        //         sale_price_per_gram: 2200,
        //         imageUrl: 'http://127.0.0.1:8000/image/Metal/1/main.jpg',
        //         specific_weight: 20,
        //         deactivated: 0,
        //         created: "20/11/2022"
        //     },
        //     is_main: 0,
        //     percentage: 0.2
        // },
        // {
        //     metal: {
        //         id: 2,
        //         name: "Gold",
        //         buy_price_per_gram: 1800,
        //         sale_price_per_gram: 2200,
        //         imageUrl: 'http://127.0.0.1:8000/image/Metal/1/main.jpg',
        //         specific_weight: 20,
        //         deactivated: 0,
        //         created: "20/11/2022"
        //     },
        //     is_main: 0,
        //     percentage: 0.2
        // },
        // {
        //     metal: {
        //         id: 3,
        //         name: "Platinum",
        //         buy_price_per_gram: 1800,
        //         sale_price_per_gram: 2200,
        //         imageUrl: 'http://127.0.0.1:8000/image/Metal/1/main.jpg',
        //         specific_weight: 20,
        //         deactivated: 0,
        //         created: "20/11/2022"
        //     },
        //     is_main: 0,
        //     percentage: 0.2
        // },
        // {
        //     metal: {
        //         id: 4,
        //         name: "Rose-Gold",
        //         buy_price_per_gram: 1800,
        //         sale_price_per_gram: 2200,
        //         imageUrl: 'http://127.0.0.1:8000/image/Metal/1/main.jpg',
        //         specific_weight: 20,
        //         deactivated: 0,
        //         created: "20/11/2022"
        //     },
        //     is_main: 0,
        //     percentage: 0.2
        // }
    ],
    isAvailable: 1,
    deactivated: 0
}
const compatibility_metal = [
    {
        metal: {
            id: 1,
            name: "Silver",
            buy_price_per_gram: 1800,
            sale_price_per_gram: 2200,
            imageUrl: 'http://127.0.0.1:8000/image/Metal/1/main.jpg',
            specific_weight: 20,
            deactivated: 0,
            created: "20/11/2022"
        },
        is_main: 0,
        percentage: 0.2
    },
    {
        metal: {
            id: 2,
            name: "Gold",
            buy_price_per_gram: 1800,
            sale_price_per_gram: 2200,
            imageUrl: 'http://127.0.0.1:8000/image/Metal/1/main.jpg',
            specific_weight: 20,
            deactivated: 0,
            created: "20/11/2022"
        },
        is_main: 0,
        percentage: 0.2
    },
    {
        metal: {
            id: 3,
            name: "Platinum",
            buy_price_per_gram: 1800,
            sale_price_per_gram: 2200,
            imageUrl: 'http://127.0.0.1:8000/image/Metal/1/main.jpg',
            specific_weight: 20,
            deactivated: 0,
            created: "20/11/2022"
        },
        is_main: 0,
        percentage: 0.2
    },
    {
        metal: {
            id: 4,
            name: "Rose-Gold",
            buy_price_per_gram: 1800,
            sale_price_per_gram: 2200,
            imageUrl: 'http://127.0.0.1:8000/image/Metal/1/main.jpg',
            specific_weight: 20,
            deactivated: 0,
            created: "20/11/2022"
        },
        is_main: 0,
        percentage: 0.2
    }
]
//Hàm format tiền
const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' VND';
    return <span>{formattedValue}</span>;
};

//Hàm tạo ra dãy size từ min, max
function generateRange(min, max) {
    const result = [];
    for (let i = min; i <= max; i += 1.0) {
        result.push(i);
    }
    return result;
}



export default function MountingDetail() {
    // Sử dụng useParams để lấy id từ đường dẫn
    const navigate = useNavigate();
    const index = useParams();
    const [loading, setLoading] = useState(true);
    const [mounting_type, setMountingType] = useState(null);
    const [model, setModel] = useState(null);



    const [mainMetal, setMainMetal] = useState(null); //biến state lưu id của kim loại Main
    const [sideMetal, setSideMetal] = useState(0); //biến state lưu id của kim loại Side
    const [fingerSize, setFingerSize] = useState(null); //biến state lưu Finger Size

    const [checkMountingType, setCheckMountingType] = useState(true); //biến state đóng mở chức năng chọn Finger Size

    const [sideMetalListVisible, setSideMetalListVisible] = useState(false); //biến state đóng mở chức năng chọn Side Metal
    const [mainMetalArray, setMainMetalArray] = useState([]); //lấy mảng model_metal Main
    const [sideMetalArray, setSideMetalArray] = useState([]); //lấy mảng model_metal Side
    const [sizeRange, setSizeRange] = useState([]); //lấy mảng Size

    const [sideMetalArrayAfter, setSideMetalArrayAfter] = useState([]); //mảng kim loại Side sau khi lọc
    const [finalModel, setFinalModel] = useState({}); //biến state lưu thông tin mẫu khung cuối cùng

    useEffect(() => {
        const finalProduct = JSON.parse(localStorage.getItem('finalProduct')); //LẤY THÔNG TIN MẪU KHUNG TỪ LOCAL STORAGE
        if (finalProduct) {
            const model_id = index.id;
            if (finalProduct.model.id != model_id) {
                console.log('model_id trong param không kớp với model_id trong finalProduct local storage')
                alert('ok')
                window.location.href = '/services';
            }


            setFingerSize(finalProduct.mounting_size); //SET FINGER SIZE

            if (finalProduct.metal_2 == null) {
                setSideMetalListVisible(false)
            } else {
                setSideMetalListVisible(true)
            }
        }
        const setAttribute = async () => {
            const mountingType_storage = JSON.stringify(localStorage.getItem('mountingType'));

            if (index && index.id && mountingType_storage) {
                setMountingType(mountingType_storage);
                const model_id = index.id;
                if (!model_id) {
                    console.log('không có model_id')
                    alert('ok')
                    window.location.href = '/services';
                }

                const formData = new FormData();
                formData.append('model_id', model_id);

                //gọi model_detail
                const model_data = await get_model_detail(formData);
                const model_detail = model_data.data.model;
                setModel(model_detail);
                setCheckMountingType(model_detail.mounting_type.id === 3 ? false : true)

                const mainMetalList = model_detail.model_metal.filter(metal => metal.is_main);
                const sideMetalList = model_detail.model_metal.filter(metal => !metal.is_main);
                console.log("mainMetalList", mainMetalList);
                console.log("sideMetalList", sideMetalList);
                setMainMetalArray(mainMetalList)

                const sizeRangeGenerate = generateRange(model_detail.mounting_type.min_size, model_detail.mounting_type.max_size)
                setSizeRange(sizeRangeGenerate)
                if (!finalProduct) {
                    setSideMetalArray(sideMetalList)

                    setMainMetal(sideMetalList.length > 0 ? null : mainMetalList[0].metal); //SET KIM LOẠI MAIN

                    setSideMetal(null);

                    setFingerSize(sizeRangeGenerate[0]);

                } else {
                    setMainMetal(finalProduct.metal_1); //SET KIM LOẠI MAIN

                    const metal_compatibility = {
                        model_id: model_detail.id,
                        metal_id: finalProduct.metal_1.id
                    }
                    console.log("metal_compatibility", metal_compatibility)
                    const formData = new FormData();
                    formData.append('metal_compatibility', JSON.stringify(metal_compatibility));
                    const compatibility_data = await get_metal_compatibility(formData);
                    setSideMetalArray(compatibility_data.data)
                    setSideMetal(finalProduct.metal_2); //SET KIM LOẠI SIDE
                }


            } else {
                window.location.href = `/template?step=1&mountingType=${mountingType_storage}`;
            }

            setLoading(false)
        }

        setAttribute();
    }, []);

    //Hàm cập nhật id của kim loại Main
    const handleMainMetalChange = (event) => {
        const newMainMetal = event.target.value;

        setMainMetal(JSON.parse(newMainMetal));
        const setCompatibility = async () => {
            if (newMainMetal !== null && sideMetalArray.length > 0) {


                const metal_compatibility = {
                    model_id: model.id,
                    metal_id: JSON.parse(newMainMetal).id
                }
                console.log("metal_compatibility", metal_compatibility)
                const formData = new FormData();
                formData.append('metal_compatibility', JSON.stringify(metal_compatibility));
                const compatibility_data = await get_metal_compatibility(formData);


                setSideMetalListVisible(true)

                setSideMetalArray(compatibility_data.data)
                setSideMetal(compatibility_data.data[0].metal);
            }
            setLoading(false)
        }
        setLoading(true)
        setCompatibility();
    }

    const showAlert = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {

            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })
    };

    //Hàm cập nhật id của kim loại Side
    const handleSideMetalChange = (event) => {
        const newSideMetal = event.target.value;
        console.log("side", newSideMetal)
        console.log("main", mainMetal)
        setSideMetal(JSON.parse((newSideMetal)));



    }

    //Hàm cập nhật Finger Size
    const handleFingerSizeChange = (event) => {
        setFingerSize(event.target.value);
    }


    const handleSelectModel = () => {

        let finalModel = JSON.parse(localStorage.getItem('finalProduct'))
        if (finalModel !== null) {
            finalModel.model = model;
            finalModel.mounting_size = fingerSize;
            finalModel.metal_1 = mainMetal;
            finalModel.metal_2 = sideMetal;
        } else {
            if (mainMetal == null || (sideMetalArray.length > 0 && fingerSize == null)) {
                return showAlert();
            }
            finalModel = {
                model: model,
                mounting_size: fingerSize,
                metal_1: mainMetal,
                metal_2: sideMetal
            }

        }

        localStorage.setItem('finalProduct', JSON.stringify(finalModel));
        //alert(model.mounting_type.id+ '   ' + model.id)
        window.location.href = '/template?step=2&mountingType=' + model.mounting_type.id + '&model_id=' + model.id; //CHUYỂN HƯỚNG SANG TRANG CHỌN KIM CƯƠNG
    }




    return (
        <div className="flex flex-col items-center mb-20">
            <h1 className="md:text-3xl xs:text-xl mt-5 mb-5 font-semibold font-loraFont text-[#151542]">Mounting Detail</h1>
            <p className="text-light mt-5 mb-5 font-semibold font-loraFont text-[#151542]">Chọn các thông số chi tiết cho mẫu khung của bạn</p>
            {loading ? <CSpinner color='primary' /> :
                <>
                    <div className="grid grid-cols-2 gap-5 w-full h-auto">
                        <div className="w-full flex items-center justify-center">
                            <img
                                className="w-3/4 h-auto object-cover border border-gray-900 shadow-lg"
                                alt={model.name}
                                src={model.imageUrl}
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <p className="w-1/2 text-3xl font-loraFont font-medium text-[#151542]">{model.name}</p>
                            <div className="w-3/4 h-0.5 bg-slate-300 mt-5 mb-5"></div>

                            {checkMountingType && (
                                <>
                                    <p className="font-loraFont font-medium text-[#151542]">Select Finger Size</p>
                                    <FormControl className="w-1/3">
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={fingerSize}
                                            label="Size"
                                            onChange={handleFingerSizeChange}
                                        >
                                            {
                                                fingerSize == null &&
                                                <MenuItem value={null}>
                                                    NO VALUE
                                                </MenuItem>
                                            }
                                            {sizeRange.map((size) => (

                                                <MenuItem value={size}>
                                                    {size}.0
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                </>
                            )
                            }
                            <p className="font-loraFont mt-5 font-medium text-[#151542]">Select Main Metal</p>
                            <FormControl className="w-1/3">
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={JSON.stringify(mainMetal)}
                                    label="Age"
                                    onChange={handleMainMetalChange}
                                >
                                    {
                                        mainMetal == null &&
                                        <MenuItem value={null}>
                                            Select Main Metal
                                        </MenuItem>
                                    }
                                    {mainMetalArray.map((item) => {
                                        //console.log("itemmmmmmmmmmmmmmmmmmmmmm", item.metal.name)
                                        return (

                                            <MenuItem key={item.metal.id} value={JSON.stringify(item.metal)}>
                                                <img
                                                    className="w-10 h-auto inline-block mr-1 align-middle"

                                                    src={item.metal.imageUrl}
                                                />
                                                {item.metal.name}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>


                            {sideMetalListVisible && (
                                <>
                                    <p className="font-loraFont mt-5 font-medium text-[#151542]" visible="false">Select Side Metal</p>
                                    <FormControl className="w-1/3">
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={JSON.stringify(sideMetal)}
                                            label="Age"
                                            onChange={handleSideMetalChange}
                                        >
                                            {sideMetalArray.map((item) => {
                                                //console.log("itemmmmmmmmmmmmmmmmmmmmmm", item.metal.imageUrl)
                                                return (

                                                    <MenuItem key={item.metal.id} value={JSON.stringify(item.metal)}>
                                                        <img
                                                            className="w-10 h-auto inline-block mr-1 align-middle"

                                                            src={item.metal.imageUrl}
                                                        />
                                                        {item.metal.name}
                                                    </MenuItem>
                                                )
                                            }
                                            )}
                                        </Select>
                                    </FormControl>
                                </>
                            )}

                            <div className="w-3/4 flex justify-center mt-5">
                                <button onClick={() => handleSelectModel()} className="text-white h-12 rounded-lg pl-5 pr-5 text-medium bg-[#151542] hover:bg-cyan-900">Select This Mounting</button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex justify-center mt-10 mb-10">
                        <div className="w-3/4 h-0.5 bg-slate-400"></div>
                    </div>


                    <div className="w-3/4 mb-2">
                        <div >
                            <p className="text-[#151542] font-loraFont font-medium">- Available Diamond Shapes: </p>
                        </div>
                        <div className="flex grid grid-cols-6 mt-5">
                            {model.model_diamond_shape.map((shape) => (
                                <div className="flex flex-col items-center justify-center w-1/4 mb-5 hover:cursor-pointer">
                                    <svg fill='none' viewBox="0 0 18 18" height="20" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-1 align-middle">
                                        <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={shape.drawing_path} />
                                    </svg>
                                    <p className="text-[#151542] hover:font-semibold font-loraFont font-medium">{shape.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="  w-3/4 mb-5">
                        <div className="flex items-center">
                            <p className="text-[#151542] font-loraFont font-medium">- Mounting Size: {model.base_width}(mm) x {model.base_height}(mm) </p>
                            <p className="ml-2 mt-px text-gray-400 text-sm">(width x height)</p>
                        </div>

                    </div>
                </>
            }




        </div>
    );
}