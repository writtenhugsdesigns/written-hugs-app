import React, { useRef } from 'react';
import { useDownloadExcel } from 'react-export-table-to-excel';
import { CSVLink } from "react-csv";
import print from 'print-js'


export default function ViewPitch({ pitch }) {

    const dummyPitch = {
        id: 1,
        wholesaler_id: 3,
        wholesaler_name: 'first wholesaler',
        description: 'this is the test pitch',
        cards: [{
            id: 1,
            name: 'first card',
            vendor_style: 'MH1001',
            description: 'first mental health card',
            upc: 101,
            sku: 111,
            barcode: 'barcode',
            front_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
            inner_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
            insert_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
            sticker_jpeg: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
            categories: [{
                category_name: 'first category',
                category_id: 1
            },
            {
                category_name: 'second category',
                category_id: 2
            }]
        },
        {
            id: 2,
            name: 'second card',
            vendor_style: 'MH1002',
            description: 'second mental health card',
            upc: 102,
            sku: 122,
            barcode: 'barcode',
            front_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
            front_tiff: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
            inner_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
            insert_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
            insert_ai: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
            raw_art: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
            sticker_jpeg: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
            sticker_pdf: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
            categories: [{
                category_name: 'first category',
                category_id: 1
            },
            {
                category_name: 'second category',
                category_id: 2
            }]
        },
        {
            id: 3,
            name: 'third card',
            vendor_style: 'MH1000',
            description: 'third mental health card',
            upc: 103,
            sku: 133,
            barcode: 'barcode',
            front_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
            front_tiff: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
            inner_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
            insert_img: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
            insert_ai: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
            raw_art: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
            sticker_jpeg: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
            sticker_pdf: 'https://drive.google.com/thumbnail?id=14va096SvAYsaZbnNlle4ulyhnC6-0MXY',
            categories: [{
                category_name: 'first category',
                category_id: 1
            }]
        }]
    }

    const getCards = (pitch) => {
        let cardsArray = [['Vendor Style', 'UPC#', 'Product Name']]
        pitch.cards.map((card) => {
            cardsArray.push([card.vendor_style, card.upc, card.description])
        })
        return cardsArray;
    }

    const tableRef = useRef(null);

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: "Pitch table",
        sheet: "Pitch"
    });

    const editPitch = () => {
        console.log("This will do pop up stuff for edit.");
    };

    const deletePitch = () => {
        console.log("BEGONE THINGY WITH Pitch", pitch.id);
    };

    return (
        <div className="container">
            <table id='pitchTable'>
                <tbody>
                    <tr>
                        <th>UPC#</th>
                        <th>Barcode</th>
                        <th>Vendor Stlye</th>
                        <th>Variation Name</th>
                        <th>Front</th>
                        <th>Inside Inscription</th>
                        <th>Insert</th>
                        <th>Sticker</th>
                        <th>Categories</th>
                    </tr>
                    {dummyPitch.cards.map((card) => {
                        return (<tr>
                            <td>{card.upc}</td>
                            <td>{card.barcode}</td>
                            <td>{card.vendor_style}</td>
                            <td>{card.name}</td>
                            <td><img src={card.front_img} /></td>
                            <td><img src={card.inner_img} /></td>
                            <td><img src={card.insert_img} /></td>
                            <td><img src={card.sticker_jpeg} /></td>
                            <td>{card.categories.map((category) => {
                                return (
                                    <p>{category.category_name}</p>
                                )
                            })}</td>
                        </tr>)
                    })}
                </tbody>
            </table>
            <br /><br />
            <table ref={tableRef}>
                <tbody>
                    <tr>
                        <th>Vendor Stlye</th>
                        <th>UPC#</th>
                        <th>Prroduct Name</th>
                    </tr>
                    {dummyPitch.cards.map((card) => {
                        return (<tr>
                            <td>{card.vendor_style}</td>
                            <td>{card.upc}</td>
                            <td>{card.description}</td>
                        </tr>)
                    })}
                </tbody>
            </table>
            <button onClick={editPitch}>Edit Pitch</button>
            <button onClick={deletePitch}>Delete</button>
            <br /><br />
            <button onClick={onDownload}>Download as excel</button>
            <br /><br />
            <CSVLink data={getCards(dummyPitch)}>Download CSV</CSVLink>;
            <br /><br />
            <button onClick={() => print('pitchTable', 'html')}>Print To PDF</button>
        </div>
    )
}