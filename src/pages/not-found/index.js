import React, { memo } from 'react'
import { Result, Button } from 'antd';
import { useHistory } from 'react-router';

export default memo(function NotFound() {
  const history = useHistory();
  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的页面不存在"
      extra={<Button type="primary" onClick={ () => { history.replace('/') } }>返回首页</Button>}
    />
  )
})
