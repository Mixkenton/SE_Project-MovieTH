import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './package.css';
import { Button, ConfigProvider } from 'antd';
import { PackageInterface } from '../../../interface/pool';
import { GetPackageInfo } from '../../../service/pool';

const Package: React.FC = () => {
    const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
    const [packages, setPackages] = useState<PackageInterface[]>([]);
    const navigate = useNavigate();

    const selectedPackageFromCookie = Cookies.get('selectedPackage');
    const token = localStorage.getItem('token');
    

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
        fetchPackages();
    }, [token, navigate]);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            let data = await GetPackageInfo();
            setPackages(data);
        } catch (error) {
            console.error('Error fetching package data:', error);
        } 
    };

    const handlePackageClick = (packageId: any) => {
        setSelectedPackage((prevSelectedPackage) => (prevSelectedPackage === packageId ? null : packageId));
        // เก็บข้อมูลลงใน Cookie
        Cookies.set('selectedPackage', packageId, { expires: 3 });
        
    };

    const handleCancelClick = () => {
        navigate(-1);
    };

    const handleNextClick = async () => {
        console.log('Selected Package from Cookie:', selectedPackageFromCookie);
        setTimeout(function () {
            navigate("/payment");
        }, 800);
    };
    

    return (
        <div>
            <ConfigProvider theme={{
                components: {
                    Button: {
                        colorPrimary: '#F5CE00',
                        algorithm: true,
                        primaryColor: '#000000',
                    },
                },
            }}>
                <div className='web-package'>
                    <div className='box-main-container'>
                        <div className='box-main-container-inner'>
                            <div className='package-text'>เลือกแพ็คเกจ</div>
                        </div>
                        {packages.map((packageItem) => (
                            <div
                                key={packageItem.ID || 0}
                                className={`package-box-selected ${selectedPackage === packageItem.ID ? 'clicked' : ''}`}
                                onClick={() => handlePackageClick(packageItem.ID ?? 0)}
                            >
                                <div className='package-box-selected-text'>{packageItem.PackageName}</div>
                                <div className='additional-box' style={{ display: "grid", gridTemplateRows: "auto auto", gap: "1px" }}>
                                    <h2>{`${packageItem.Price} บาท`}</h2>
                                    {`ดูได้ ${packageItem.PackageDetail?.split(' ')[1]} จอ`}
                                    <p>{`${packageItem.PackageDetail?.split(' ')[2]}`}</p>
                                    <p>{`${packageItem.PackageDetail?.split(' ')[3]}`}</p>
                                    <p>{`${packageItem.PackageDetail?.split(' ')[4]}`}</p>
                                </div>
                            </div>
                        ))}
                        <div className='button-cancel'>
                            <Button onClick={handleCancelClick} style={{ width: '100px', height: "40px", fontFamily: 'Mitr', fontSize: 20, textAlign: "center" }} danger>
                                ยกเลิก
                            </Button>
                        </div>
                        <div className='button-next'>
                            <Button onClick={handleNextClick} style={{ width: '100px', height: "40px", fontFamily: 'Mitr', fontSize: 20, textAlign: "center" }} >
                                ถัดไป
                            </Button>
                        </div>
                    </div>
                </div>
            </ConfigProvider>
        </div>
    );
};

export default Package;
