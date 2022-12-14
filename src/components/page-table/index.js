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
  rowSelection,
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
        rowSelection={rowSelection}
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
          showTotal={total => `???${total}???`}
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
  columns: PropTypes.array.isRequired, // ???????????????
  getListFn: PropTypes.func.isRequired, // ???????????????????????????
  tableConfig: PropTypes.object, // ???????????????antd???
  pageConfig: PropTypes.object, // ??????????????????antd???
  initGet: PropTypes.bool, // ??????????????????????????????
  showSearch: PropTypes.bool, // ?????????????????????
  searchKey: PropTypes.string, // ??????????????????key
  searchPlaceHolder: PropTypes.string, // ?????????placeholder
  isPage: PropTypes.bool, // ????????????
  pageIn: PropTypes.oneOf(['start', 'center', 'end']) // ???????????????
}

PageTable.defaultProps = {
  initGet: false,
  showSearch: false,
  searchKey: 'searchKey',
  searchPlaceHolder: '?????????????????????',
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
      if(Array.isArray(res.result)) {
        setList(res.result.map((item, index) => ({
          key: index,
          ...item
        })));
      }
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

