import { ConfigProvider , Button} from 'antd';
import {useNavigate} from 'react-router-dom';
import './firstpage.css'

export default function FirstPage(){
    const navigate = useNavigate();

    function onClickLogin(){
      navigate("/login");
  }
  
    function onClickReg(){
      navigate("/register");
    }
    return(
        <ConfigProvider theme={{
            components:{
                Button:{
                    colorPrimary: '#F5CE00',
                    algorithm: true,
                    primaryColor: '#000000',
                },
            },
        }}>
          <div className="Firstpage">
            <div className='bg'>
              <div className='button01'>
                <Button style={{fontSize: 20,width: 160,height:50,fontFamily:'Mitr'}} type='primary' onClick={onClickLogin}><b>เข้าสู่ระบบ</b></Button>
              </div>
              <div className='button02'>
                <Button style={{fontSize: 20,width: 160,height:50,fontFamily:'Mitr'}} type='primary' onClick={onClickReg}><b>สมัครสมาชิก</b></Button>
            </div>
            </div>
          </div>
          </ConfigProvider>
    );
}