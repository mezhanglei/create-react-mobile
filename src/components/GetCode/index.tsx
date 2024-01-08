import type { ButtonProps } from 'antd-mobile';
import { Button } from 'antd-mobile';
import React, { useEffect, useRef, useState } from 'react';
import './index.less';
import classnames from 'classnames';

export interface GetCodeProps extends ButtonProps {
  onSend: () => Promise<any>; // 发送验证码的promise方法
}

const TOTAL_TIME = 60;
const GetCode = React.forwardRef<{ sendMsg: () => void }, GetCodeProps>((props, ref) => {
  const { onSend, className, ...rest } = props;
  const [count, setCount] = useState<number>();
  const [message, setMessage] = useState<string>('发送验证码');
  const [disabled, setDisabled] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>();
  const canSendRef = useRef<boolean>(true);
  const timerRef = useRef<any>();

  React.useImperativeHandle(ref, () => ({
    sendMsg,
  }));

  useEffect(() => {
    visiblityListen();
  }, []);

  const resetBtn = () => {
    setMessage(!count ? message : '重新发送');
    clearInterval(timerRef.current);
    timerRef.current = null;
    setDisabled(false);
    canSendRef.current = true;
  };

  const visiblityListen = () => {
    let start: number, end: number, vibs: number, newS: number;
    document.addEventListener('visibilitychange', () => {
      // hidden 为锁屏隐藏状态，visible为重新显示状态
      if (document.visibilityState === 'hidden') {
        start = new Date().getTime();
      } else if (document.visibilityState === 'visible') {
        end = new Date().getTime();
        vibs = Math.floor((end - start) / 1000);
        newS = (count || 0) - vibs;
        if (newS > 0) {
          setCount(newS);
        } else if (newS < 0) {
          resetBtn();
          setCount(undefined);
        }
      }
    });
  };

  const sendMsg = async () => {
    const canSend = canSendRef.current;
    if (typeof onSend !== 'function') return;
    if (loading) return;
    if (canSend) {
      setLoading(true);
      try {
        const data = await onSend();
        setLoading(false);
        setDisabled(true);
        if (!data) return;
        if (!timerRef.current) {
          canSendRef.current = false;
          setCount(TOTAL_TIME);
          setMessage('s后重发');
          timerRef.current = setInterval(() => {
            setCount(oldCount => {
              if (oldCount && oldCount <= TOTAL_TIME) {
                return oldCount - 1;
              } else {
                resetBtn();
                return undefined;
              }
            });
          }, 1000);
        }
      } catch (error) {
        setLoading(false);
      }
    }
  };

  const btnText = loading ? '发送中' : (count || '') + message;

  return (
    <Button
      className={classnames('send-message', className)}
      onClick={sendMsg}
      disabled={disabled}
      loading={loading}
      {...rest}
    >
      {btnText}
    </Button>
  );
});

export default GetCode;
