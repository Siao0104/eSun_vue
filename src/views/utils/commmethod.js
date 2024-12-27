/* rowStatus更改時機 */
export const changeRowStatus = (row) => {
    if(row.rowStatus !== "C"){
        row.rowStatus = "U";
    }
}