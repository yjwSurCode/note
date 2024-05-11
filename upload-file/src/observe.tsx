import React, { useEffect, useRef } from 'react';

const listData = Array.from({ length: 50 }, (_, i) => i + 1);

function ObserverTestPage() {
  const observeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const callback: IntersectionObserverCallback = (enters) => {
      for (const item of enters) {
        if (item.isIntersecting) {
          console.log('监听的dom出现了====');
          // 第一次出现之后，后续停止对此dom的监听
          observe.unobserve(item.target);
        }
      }
    };

    const observe = new IntersectionObserver(callback);
    if (observeRef.current) {
      observe.observe(observeRef.current);
    }

    // 组件销毁的时候，停止所有监听
    return () => observe.disconnect();
  }, []);

  return (
    <div className="ImageLazy">
      <div className="plac">
        {listData.map((v) => (
          <div key={v}>{v}</div>
        ))}
      </div>
      <div ref={observeRef} className="observe">
        this is dom
      </div>
    </div>
  );
}

export default ObserverTestPage;
