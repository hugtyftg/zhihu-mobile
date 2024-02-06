import React, { useState } from 'react';
import { Button } from 'antd-mobile';
/* 封装loading button  */
export default function ButtonAgain(props) {
  let [loading, setLoading] = useState(false);
  const clickHandle = async () => {
    setLoading(true);
    try {
      await handle();
    } catch (error) {
    } finally {
      // 无论成功与否，最后都会修改状态
      setLoading(false);
    }
  };
  /* props只读 */
  let options = { ...props };
  let { children, onClick: handle } = options;
  delete options.children;
  /* 如果传入方法，那么用我们的方法替换原来的方法，如果没传就不用再管了 */
  if (handle) options.onClick = clickHandle;
  return (
    <Button loading={loading} {...props} onClick={clickHandle}>
      {children}
    </Button>
  );
}
