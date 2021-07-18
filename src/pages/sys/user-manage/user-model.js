import React, { memo } from 'react';
import { Modal, Form, Input, Switch, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styled from 'styled-components';


const UserModal = memo(function ({
  setHide,
  ...args
}) {
  return (
    <Modal
      width={480}
      onCancel={setHide}
      {...args}
    >
      <StyleWrap>
        
      <Form>
        <Form.Item label="头像">
          <Upload
            className="avatar"
            name="avatar"
            listType="picture-card"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          >
            <div className="upload-btn">
              <UploadOutlined className="icon"/>
              <div className="txt">上传头像</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item label="账号" name="account">
          <Input placeholder="请输入账号，需唯一" />
        </Form.Item>
        <Form.Item label="姓名" name="name">
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item label="电话" name="phone">
          <Input placeholder="请输入电话" />
        </Form.Item>
        <Form.Item label="角色" name="role">
          <Select placeholder="请选择角色">
            <Select.Option value="ROLE_ADMIN">管理员</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="启用" name="enabled" valuePropName="checked">
          <Switch defaultChecked />
        </Form.Item>
      </Form>
      </StyleWrap>
    </Modal>
  )
})

const StyleWrap = styled.div`
  .avatar {
    .ant-upload-select-picture-card {
      width: 80px;
      height: 80px;
    }
    .upload-btn {
      .icon {
        font-size: 16px;
      }
      .txt {
        font-size: 12px;
      }
    }
  }
`;

export default UserModal