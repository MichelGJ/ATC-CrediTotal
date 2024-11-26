/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.css';

const Public = () => {
    return (
        <div>
            <Head>
                <title>Cola Atencion al Cliente</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <div className="top-bar">
                <img src="/images/banner.png" alt="Company Logo" className="logo" aria-label="Company Logo" />
            </div>

            <table id="public_table">
                <tbody>
                    <tr>
                        <td valign="middle" className="ticket-current">
                            <br />
                            <span id="lbl-desk-01" className="ticket-current-desk">Mesa W</span>
                            <br />
                            <span id="lbl-cedula-01" className="cedula-current-number">Cédula W</span>
                            <br />
                            <span id="lbl-ticket-01" className="ticket-current-number">Ticket W</span>
                        </td>
                        <td className="secondary-table">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <br />
                                            <br />
                                            <span id="lbl-desk-02" className="ticket-secondary-desk">Mesa X</span>
                                            <br />
                                            <span id="lbl-cedula-02" className="cedula-secondary">Cédula X</span>
                                            <br />
                                            <span id="lbl-ticket-02" className="ticket-secondary">Ticket X</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <br />
                                            <br />
                                            <span id="lbl-desk-03" className="ticket-secondary-desk">Mesa Y</span>
                                            <br />
                                            <span id="lbl-cedula-03" className="cedula-secondary">Cédula Y</span>
                                            <br />
                                            <span id="lbl-ticket-03" className="ticket-secondary">Ticket Y</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <br />
                                            <br />
                                            <span id="lbl-desk-04" className="ticket-secondary-desk">Mesa Z</span>
                                            <br />
                                            <span id="lbl-cedula-04" className="cedula-secondary">Cédula Z</span>
                                            <br />
                                            <span id="lbl-ticket-04" className="ticket-secondary">Ticket Z</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    );
};

export default Public;