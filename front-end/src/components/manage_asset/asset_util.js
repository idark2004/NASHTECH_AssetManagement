export const sortAsset = (rule, responseObj) => {
    switch (rule) {

        case "categoryName": {
            let sortData = responseObj.data.sort((a, b) => {
                if (a.categoryName === b.categoryName) return 0;
                if (a.categoryName < b.categoryName) return -1;
                if (a.categoryName > b.categoryName) return 1;
            })
            return sortData;
        }
        case "assetName": {
            let sortData = responseObj.data.sort((a, b) => {
                if (a.assetName === b.assetName) return 0;
                if (a.assetName < b.assetName) return -1;
                if (a.assetName > b.assetName) return 1;
            })
            return sortData;
        }
        case "assetCode": {
            let sortData = responseObj.data.sort((a, b) => {
                if (a.assetCode === b.assetCode) return 0;
                if (a.assetCode < b.assetCode) return -1;
                if (a.assetCode > b.assetCode) return 1;
            })
            return sortData;
        }
        case "state": {
            let sortData = responseObj.data.sort((a, b) => {
                if (a.state === b.state) return 0;
                if (a.state < b.state) return -1;
                if (a.state > b.state) return 1;
            })
            return sortData;
        }

    }
}