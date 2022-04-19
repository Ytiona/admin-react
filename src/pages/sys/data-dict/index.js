import React, {
  memo,
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { Space, Button, Tag, Tree, Input, Modal, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { StyleWrap } from "./style";
import { useBool } from "@/hooks/base-hooks";
import PageTable from "@/components/page-table";
import * as systemApi from "@/api/system";
import DictModal from "./dict-modal";
import AoeModal from "@/components/aoe-modal";
import DictItemForm from "./dict-item-form";

const DataDictionary = memo(function () {
  // 字典相关
  const onSearch = (value) => {
    const trimVal = value.trim();
    if (window.isEmpty(trimVal)) {
      return setDictList(sourceDictList.current);
    }
    setDictList(
      sourceDictList.current.filter((item) => item.title.includes(trimVal))
    );
  };
  const sourceDictList = useRef();
  const [dictList, setDictList] = useState();
  const getDictList = useCallback(() => {
    systemApi.getDictList().then((res) => {
      sourceDictList.current = res.result || [];
      setDictList(sourceDictList.current);
    });
  }, []);
  useEffect(getDictList, [getDictList]);

  const checkSelectDict = () => {
    const { current: _currentDict } = currentDictRef;
    if (!_currentDict) {
      message.error("请选择字典");
      return false;
    }
    setCurrentDict(_currentDict);
    return true;
  }

  // 新增、编辑、删除字典
  const currentDictRef = useRef(null);
  const [currentDict, setCurrentDict] = useState(null);
  const {
    state: addDictVisible,
    setTrue: openAddDict,
    setFalse: closeAddDict,
  } = useBool();
  const {
    state: editDictVisible,
    setTrue: openEditDict,
    setFalse: closeEditDict,
  } = useBool();
  const onSelectDict = useCallback((selectedKeys, { selected, node }) => {
    const { title, key, sort_val, remarks, id } = node;
    if (selected) {
      currentDictRef.current = {
        id,
        sort_val,
        remarks,
        name: title,
        code: key,
      };
      dictItemsRef.current.getList();
    } else {
      currentDictRef.current = null;
    }
  }, []);
  const onEditDict = () => {
    if(checkSelectDict()) {
      openEditDict();
    }
  };
  const onDeleteDict = () => {
    const { current: _currentDict } = currentDictRef;
    if (!_currentDict) return message.error("请选择字典");
    Modal.confirm({
      title: "确认删除？",
      content: `您确认要删除字典：${_currentDict.name}？`,
      onOk: () => {
        systemApi
          .deleteDict({
            id: _currentDict.id,
          })
          .then(getDictList);
      },
    });
  };

  // 字典数据相关
  const dictItemsRef = useRef({});
  const selectDictItems = useRef([]);
  const dictItemColumns = useMemo(() => {
    return [
      { title: "名称", dataIndex: "name" },
      { title: "数据值", dataIndex: "value" },
      { title: "备注", dataIndex: "remarks" },
      { title: "排序值", dataIndex: "sort_val" },
      {
        title: "状态",
        dataIndex: "enabled",
        width: 80,
        align: "center",
        render: (enabled) => (
          <>
            {enabled ? (
              <Tag color="success">启用</Tag>
            ) : (
              <Tag color="error">禁用</Tag>
            )}
          </>
        ),
      },
      { title: "创建时间", dataIndex: "create_time" },
      {
        title: "操作",
        width: 150,
        align: "center",
        render: (row) => {
          return (
            <>
              <Button size="small" type="link" onClick={onEditDictItem.bind(null, row)}>编辑</Button>
              <Button size="small" type="link" onClick={onDeleteDictItem.bind(null, [row])}>删除</Button>
            </>
          );
        },
      },
    ];
  }, []);
  const getDictItems = useCallback(() => {
    return systemApi.getDictItems({
      code: currentDictRef.current?.code,
    });
  }, []);

  //新增、编辑、删除字典数据
  const {
    state: addDictItemVisible,
    setTrue: openAddDictItem,
    setFalse: closeAddDictItem,
  } = useBool();
  const onAddDictItem = useCallback(() => {
    if(checkSelectDict()) {
      openAddDictItem();
    }
  }, [])
  const {
    state: editDictItemVisible,
    setTrue: openEditDictItem,
    setFalse: closeEditDictItem,
  } = useBool();
  const [currentDictItem, setCurrentDictItem] = useState();
  const onEditDictItem = useCallback((dictItem) => {
    setCurrentDictItem(dictItem);
    openEditDictItem();
  }, [])

  const onDeleteDictItem = (dictItems) => {
    if(checkSelectDict()) {
      Modal.confirm({
        onOk: () => {
          systemApi.deleteDictItems({
            ids: dictItems.map(item => item.id)
          }).then(dictItemsRef.current.getList)
        },
        title: '确认删除？',
        content: <>
          <p>{`您确认要删除数据：`}</p>
          <ul>
            {
              dictItems.map((item, index) => (
                <li key={index}>
                  {item.name}
                  <span className="ml-5 min-desc">{item.value}</span>
                </li>
              ))
            }
          </ul>
        </>
      })
    }
  }

  return (
    <StyleWrap>
      <DictModal
        title="添加字典"
        visible={addDictVisible}
        setHide={closeAddDict}
        requestFn={systemApi.addDict}
        onFinish={getDictList}
      />
      <DictModal
        title="编辑字典"
        visible={editDictVisible}
        setHide={closeEditDict}
        requestFn={systemApi.updateDict}
        onFinish={getDictList}
        dict={currentDict}
      />

      <AoeModal
        title="添加数据"
        visible={addDictItemVisible}
        setHide={closeAddDictItem}
        request={systemApi.addDictItem}
        params={{ dictId: currentDict?.id }}
        onFinish={dictItemsRef.current.getList}
      >
        <DictItemForm />
      </AoeModal>
      <AoeModal
        title="编辑数据"
        visible={editDictItemVisible}
        setHide={closeEditDictItem}
        request={systemApi.updateDictItem}
        onFinish={dictItemsRef.current.getList}
        editData={currentDictItem}
      >
        <DictItemForm />
      </AoeModal>
      <div className="list">
        <Space className="mb-10">
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddDict}>
            添加字典
          </Button>
          <Button icon={<EditOutlined />} onClick={onEditDict}>
            编辑字典
          </Button>
          <Button icon={<DeleteOutlined />} onClick={onDeleteDict}>
            删除字典
          </Button>
        </Space>
        <Input.Search
          className="mb-10 w-full"
          placeholder="搜索字典"
          onSearch={onSearch}
        />
        <Tree treeData={dictList} onSelect={onSelectDict} />
      </div>
      <div className="items">
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAddDictItem}
          >
            添加数据
          </Button>
          <Button icon={<DeleteOutlined />} onClick={() => {onDeleteDictItem(selectDictItems.current)}}>删除数据</Button>
        </Space>
        <PageTable
          ref={dictItemsRef}
          getListFn={getDictItems}
          columns={dictItemColumns}
          rowSelection={{
            fixed: true,
            columnWidth: 50,
            onChange: (keys, rows) => (selectDictItems.current = rows),
          }}
        />
      </div>
    </StyleWrap>
  )
})

export default DataDictionary;
