import React, { memo, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Modal, Form, Input, Switch, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import * as systemApi from '@/api/system';

const UserModal = memo(forwardRef(function ({
  user,
  setHide,
  onFinish,
  requestFn,
  ...args
}, ref) {
  const [roleList, setRoleList] = useState([]);
  useEffect(() => {
    systemApi.getRoleList().then(res => {
      setRoleList(res.result || []);
    })
  }, [])
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [formRef] = Form.useForm();
  const onConfirmAddUser = () => {
    formRef.validateFields().then(values => {
      setConfirmLoading(true);
      requestFn(values).then(() => {
        setHide();
        onFinish();
      }).finally(() => {
        setConfirmLoading(false);
      })
    })
  }
  useEffect(() => {
    formRef.setFieldsValue(user);
  }, [user])
  useImperativeHandle(ref, () => ({
    formRef
  }))
  return (
    <Modal
      width={480}
      onCancel={setHide}
      {...args}
      onOk={onConfirmAddUser}
      confirmLoading={confirmLoading}
    >
      <StyleWrap>
        <Form labelCol={{ span: 3 }} form={formRef}>
          <Form.Item label="头像" name="avatar">
            <Upload
              className="avatar"
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            >
              <div className="upload-btn">
                <UploadOutlined className="icon" />
                <div className="txt">上传头像</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item label="账号" name="account" rules={[{ required: true }]}>
            <Input placeholder="请输入账号，需唯一" />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{ required: true }]}>
            <Input placeholder="请输入密码" />
          </Form.Item>
          <Form.Item label="角色" name="role" rules={[{ required: true }]}>
            <Select placeholder="请选择角色">
              {
                roleList.map(role => (
                  <Select.Option value={role.code} key={role.code}>{ role.name }</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item label="姓名" name="name">
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="电话" name="phone">
            <Input placeholder="请输入电话" />
          </Form.Item>
          <Form.Item label="启用" name="enabled" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      </StyleWrap>
    </Modal>
  )
}))

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