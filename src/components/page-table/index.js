import React, { memo, useState, useCallback, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Table, Pagination, Input } from 'antd';
import PropTypes from 'prop-types';
import { useUpdateEffect } from '@/hooks/base-hooks';
import { PageTableWrap } from './style';

const defaultTableConfig = {
  bordered: true,
  size: "middle",
  scroll: { x: true },
  pagination: false
}

const PageTable = forwardRef(function PageTable({
  columns,
  getListFn,
  initGet,
  pageIn,
  defaultPageSize,
  showSearch,
  searchKey,
  searchPlaceHolder,
  tableConfig,
  pageConfig,
  topLeft,
  topRight,
  searchRight,
  searchLeft
}, ref) {
  const defaultParams = useRef({});
  const {
    list,
    getList,
    loading,
    pageIndex,
    setPageIndx,
    pageSize,
    setPageSize,
    total
  } = usePage({
    getListFn, 
    defaultPageSize,
    defaultParams: defaultParams.current
  });
  useEffect(() => {
    if(initGet) {
      getList();
    }
  }, [initGet, getList])
  useImperativeHandle(ref, () => ({
    getList
  }))
  return (
    <PageTableWrap>
      <div className="flex between mb-10">
        {
          topLeft ?
          <div className="left">
            {topLeft}
          </div> : null
        }
        <div className="search-box">
          { searchLeft }
          {
            showSearch ?
            <Input.Search
              enterButton 
              className="w-300" 
              placeholder={searchPlaceHolder}
              onChange={e => defaultParams.current[searchKey] = e.target.value}
              onSearch={() => getList(true)}
            /> : null
          }
          { searchRight }
        </div>
        {
          topRight ?
          <div className="right">
            {topRight}
          </div> : null
        }
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={list}
        {...defaultTableConfig}
        {...tableConfig}
        className="mb-10"
      />
      <div className={`page ${pageIn}`}>
        <Pagination 
          total={total}
          current={pageIndex}
          pageSize={pageSize}
          defaultPageSize={defaultPageSize}
          size="small"
          showTotal={total => `共${total}条`}
          showTitle
          showSizeChanger
          showQuickJumper
          {...pageConfig}
          onChange={setPageIndx}
          onShowSizeChange={(current, size) => setPageSize(size)}
        />
      </div>
    </PageTableWrap>
  )
})

PageTable.propTypes = {
  columns: PropTypes.array.isRequired, // 表格列配置
  getListFn: PropTypes.func.isRequired, // 获取列表数据的方法
  tableConfig: PropTypes.object, // 表格配置（antd）
  pageConfig: PropTypes.object, // 分页器配置（antd）
  initGet: PropTypes.bool, // 初始是否获取列表数据
  showSearch: PropTypes.bool, // 是否显示搜索框
  searchKey: PropTypes.string, // 搜索请求参数key
  searchPlaceHolder: PropTypes.string, // 搜索框placeholder
  isPage: PropTypes.bool, // 是否分页
  pageIn: PropTypes.oneOf(['start', 'center', 'end']) // 页码器位置
}

PageTable.defaultProps = {
  initGet: false,
  showSearch: false,
  searchKey: 'searchKey',
  searchPlaceHolder: '输入关键词搜索',
  isPage: true,
  pageIn: 'end',
  defaultPageSize: 10
}

function usePage({ defaultPageSize, getListFn, defaultParams = {} }) {
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndx] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const getList = useCallback((isReset = false, params = {}) => {
    setLoading(true);
    if(isReset) setPageIndx(1);
    return getListFn({
      pageIndex,
      pageSize,
      ...defaultParams,
      ...params
    }).then(res => {
      setTotal(res.total);
      setList(res.result.map((item, index) => ({
        key: index,
        ...item
      })));
    }).finally(() => {
      setLoading(false);
    })
  }, [getListFn])
  useUpdateEffect(() => {
    getList();
  }, [pageIndex, pageSize, getList])
  return {
    list,
    getList,
    loading,
    pageIndex,
    setPageIndx,
    pageSize,
    setPageSize,
    total
  }
}

export default memo(PageTable);

