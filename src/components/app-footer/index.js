import { CopyrightOutlined } from '@ant-design/icons';
import { FooterWrap } from './style';

export default function AppFooter () {
  return (
    <FooterWrap>
      <span className="icon">
        <CopyrightOutlined />
      </span>
      Li Yu
    </FooterWrap>
  )
}

