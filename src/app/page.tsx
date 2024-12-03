'use client';
//REACT,NEXT
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
//APIS
import apiClient from '@/utils/apiClient';
import { endpoints } from '@/constants/api';
//TYPES
import { Todo } from '@/types/todo';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  // 할 일 목록 조회
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get<Todo[]>(endpoints.items);
      setTodos(data);
    } catch (error) {
      console.error('할 일 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 새로운 할 일 추가
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    try {
      const { data: newTodo } = await apiClient.post<Todo>(endpoints.items, {
        name: inputValue,
      });
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setInputValue('');
    } catch (error) {
      console.error('할 일 추가 실패:', error);
    }
  };

  // 할 일 상태 변경
  const toggleTodoStatus = async (id: number, isCompleted: boolean) => {
    try {
      const { data: updatedTodo } = await apiClient.patch<Todo>(
        endpoints.item(id),
        { isCompleted: !isCompleted }
      );
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (error) {
      console.error('상태 변경 실패:', error);
    }
  };

  // 할 일 삭제
  // const deleteTodo = async (id: number) => {
  //   try {
  //     await apiClient.delete(endpoints.item(id));
  //     setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  //   } catch (error) {
  //     console.error('할 일 삭제 실패:', error);
  //   }
  // };

  // 컴포넌트가 처음 렌더링될 때 할 일 목록을 불러옴
  useEffect(() => {
    fetchTodos();
  }, []);

  const ongoingTodos = todos.filter((todo) => !todo.isCompleted);
  const completedTodos = todos.filter((todo) => todo.isCompleted);


  return (
    <main className="pt-6 px-6 xl:w-[1200px] h-screen">
      {/* Input Field */}
      <form className="flex sm:space-x-2 md:space-x-4 mb-10" onSubmit={addTodo}>
        <input
          type="text"
          placeholder="할 일을 입력해주세요"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="sm:w-[280px] md:w-[518px] xl:w-[1016px] 
          h-[56px] px-6 py-4 border-[2px] border-slate09 border-r-[4px] border-b-[5px] rounded-full placeholder:font-normal outline-none"
        />
        <button
          type="submit"
          className={`sm:w-[56px] md:w-[162px] xl:w-[168px] flex-all-center
          h-[56px] px-4 border-[2px] border-slate09 border-r-[4px] border-b-[5px] rounded-full placeholder:font-normal 
          ${inputValue.trim() ? 'bg-violet06 text-white' : 'bg-violet01 text-black'}`}
        >
          {/* Small Image for mobile */}
          <Image
            className="block md:hidden"
            src={inputValue.trim() ? '/svgs/ic-plus.svg' : '/svgs/ic-plus-black.svg'}
            alt="icon-Plus"
            width={16}
            height={16}
            priority
          />
          {/* Large image for tablet and desktop */}
          <Image
            className="hidden md:block"
            src={inputValue.trim() ? '/svgs/ic-plus.svg' : '/svgs/ic-plus-black.svg'}
            alt="icon-Plus"
            width={16}
            height={16}
            priority
          />
          <span className="hidden md:block md:ml-1">추가하기</span>
        </button>
      </form>
      <div className="sm:flex sm:flex-col xl:flex-row xl:justify-between gap-[24px]">
        {/* Todo */}
        <div className="xl:w-[600px]">
          <div className="flex-all-center text-[18px] font-semibold w-[100px] h-9 bg-lime text-green-700 rounded-[24px] mb-4">
            TO DO
          </div>
          {/* TODO LIST */}
          <article className="mb-16 flex flex-col items-center justify-center xl:py-16">
            {ongoingTodos.length === 0 ? (
              <>
                {/* Small Image for mobile */}
                <Image
                  className="block xl:hidden"
                  src="/svgs/img-todo-small.svg"
                  alt="NONE-TODO"
                  width={120}
                  height={120}
                  priority
                />
                {/* Large image for tablet and desktop */}
                <Image
                  className="hidden xl:block"
                  src="/svgs/img-todo-large.svg"
                  alt="NONE-TODO"
                  width={240}
                  height={240}
                  priority
                />
                <p className="text-center leading-5 text-slate04 sm:mt-4 md:mt-6">
                  할 일이 없어요.
                  <br />
                  TODO를 새롭게 추가해주세요!
                </p>
              </>
            ) : (
              <ul className="w-full space-y-4">
                {ongoingTodos.map((todo) => (
                  <li
                    key={todo.id}
                    onClick={() => router.push(`/items/${todo.id}`)}
                    className="space-x-2 flex items-center sm:w-[344px] md:w-[696px] xl:w-[588px] h-[50px] border-slate09 border-[2px] rounded-[27px] px-3 py-2 cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <button
                          onClick={() => toggleTodoStatus(todo.id, todo.isCompleted)}
                          className="focus:outline-none"
                        >
                          <Image
                            src={todo.isCompleted ? '/svgs/ic-checkbox-on.svg' : '/svgs/ic-checkbox-off.svg'}
                            alt={todo.isCompleted ? 'Completed' : 'Ongoing'}
                            width={24}
                            height={24}
                          />
                      </button>
                    </div>
                    <span>{todo.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
        {/* Done */}
        <div className="xl:w-[600px]">
          <div className="flex-all-center text-[18px] font-semibold w-[100px] h-9 bg-green-700 text-[#FCD34D] rounded-[24px] mb-4">
            DONE
          </div>
          {/* DONE LIST */}
          <article className="mb-16 flex flex-col items-center justify-center xl:py-16">
            {completedTodos.length === 0 ? (
              <>
                {/* Small Image for mobile */}
                <Image
                  className="block xl:hidden"
                  src="/svgs/img-done-small.svg"
                  alt="NONE-TODO"
                  width={120}
                  height={120}
                  priority
                />
                {/* Large image for tablet and desktop */}
                <Image
                  className="hidden xl:block"
                  src="/svgs/img-done-large.svg"
                  alt="NONE-TODO"
                  width={240}
                  height={240}
                  priority
                />
                <p className="text-center leading-5 text-slate04 sm:mt-4 md:mt-6">
                  아직 다 한 일이 없어요.
                  <br />
                  해야 할 일을 체크해보세요!
                </p>
              </>
            ) : (
              <ul className="w-full space-y-4">
                {completedTodos.map((todo) => (
                  <li
                    key={todo.id}
                    onClick={() => router.push(`/items/${todo.id}`)}
                    className="space-x-2 flex items-center sm:w-[344px] md:w-[696px] xl:w-[588px] h-[50px] border-slate09 border-[2px] bg-violet01 text-slate08 rounded-[27px] px-3 py-2 cursor-pointer"
                  >
                    {/* Toggle Status Button */}
                    <button
                      onClick={() => toggleTodoStatus(todo.id, todo.isCompleted)}
                      className="focus:outline-none"
                    >
                      <Image
                        src={todo.isCompleted ? '/svgs/ic-checkbox-on.svg' : '/svgs/ic-checkbox-off.svg'}
                        alt={todo.isCompleted ? 'Completed' : 'Ongoing'}
                        width={24}
                        height={24}
                      />
                    </button>
                    <span className="ml-3 line-through">{todo.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
      </div>
    </main>
  );
}
