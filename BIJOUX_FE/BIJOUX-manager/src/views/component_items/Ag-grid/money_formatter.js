import numeral from "numeral";

export const CurrencyFormatterLowercase = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' vnd';
    return <span>{formattedValue}</span>;
};

export const CurrencyFormatterUppercase = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' VND';
    return <span>{formattedValue}</span>;
}
export const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') ;
    return <span>{formattedValue}</span>;
}

export const CurrencyFormatterText = ( value ) => {
    const formattedValue = numeral(value).format('0,0') ;
    return formattedValue;
}
