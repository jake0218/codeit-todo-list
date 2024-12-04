'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import apiClient from '@/utils/apiClient';
import { endpoints } from '@/constants/api';
import Image from 'next/image';
import { Todo } from '@/types/todo';

const ItemDetailPage = () => {
  const { itemId } = useParams() as { itemId: string };
  const router = useRouter();
  const [item, setItem] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);
        const numericItemId = parseInt(itemId, 10);
        const { data } = await apiClient.get<Todo>(endpoints.item(numericItemId));
        setItem(data);
      } catch (err: unknown) {
        setError('항목을 불러오는 중 오류가 발생했습니다.');
        console.error('API 호출 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleDelete = async () => {
    if (!item) return;
    try {
      await apiClient.delete(endpoints.item(item.id));
      alert('항목이 삭제되었습니다.');
      router.push('/');
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('항목 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleUpdate = async () => {
    if (!item) return;
  
    const updatedItem = {
      name: item.name,
      memo: item.memo || '',
      imageUrl: selectedImage ? item.imageUrl || '' : '', // 조건부로 이미지 포함
      isCompleted: item.isCompleted,
    };
  
    try {
      const { data } = await apiClient.patch(endpoints.item(item.id), updatedItem);
      alert('항목이 수정되었습니다.');
      setItem(data);
      setSelectedImage(null); // 이미지 상태 초기화
      router.push('/');
    } catch (err) {
      console.error('수정 실패:', err);
      alert('수정 요청 중 오류가 발생했습니다.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file); 
  
      setItem((prev) => (prev ? { ...prev, imageUrl: URL.createObjectURL(file) } : null));
    }
  };

  if (loading) return <div className="p-6 text-center">로딩 중...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!item) return <div className="p-6 text-center">항목을 찾을 수 없습니다.</div>;

  console.log('API 요청 URL:', endpoints.item(item.id));

  return (
    <main className="p-6 xl:w-[1200px] mx-auto space-y-6 xl:px-[102px]">
      {/* 항목 정보 */}
      <div
        className={`flex items-center justify-center p-4 border-[2px] rounded-[27px] ${
          item.isCompleted ? 'bg-violet01 text-slate08 underline' : 'border-slate09 underline'
        }`}
      >
        <button
          onClick={() => setItem({ ...item, isCompleted: !item.isCompleted })}
          className="focus:outline-none"
        >
          <Image
            src={item.isCompleted ? '/svgs/ic-checkbox-on.svg' : '/svgs/ic-checkbox-off.svg'}
            alt={item.isCompleted ? 'Completed' : 'Ongoing'}
            width={24}
            height={24}
          />
        </button>
        <span className="ml-4">{item.name}</span>
      </div>

      {/* 메모 및 이미지 첨부 */}
      <div className="flex flex-col xl:flex-row xl:items-start gap-4">
        {/* 이미지 첨부 */}
        <div
          className="relative w-full xl:w-[311px] h-[311px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md overflow-hidden"
        >
          {item.imageUrl ? (
            <Image
              src={item.imageUrl || '/svgs/ic-noImg.svg'}
              alt="첨부 이미지"
              width={311}
              height={311}
              className="object-cover rounded-md"
            />
          ) : (
            <Image
              src="/svgs/ic-noImg.svg"
              alt="No Image"
              width={100}
              height={100}
              className="opacity-50"
            />
          )}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageUpload}
          />
        </div>
        {/* 메모 입력 */}
          <div className="relative w-full xl:w-[588px] h-[311px]">
            <Image
              src="/svgs/img-memo.svg"
              alt="Memo Background"
              layout="fill"
              className="object-cover rounded-md"
            />
            <textarea
              value={item.memo || ''}
              onChange={(e) => setItem({ ...item, memo: e.target.value })}
              className="absolute inset-0 bg-transparent resize-none p-4 text-slate08 font-semibold outline-none"
              placeholder="메모를 입력하세요..."
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex items-center justify-center xl:justify-end space-x-4 mt-6">
          <button
            onClick={handleUpdate}
            className={`w-[168px] flex-all-center
            h-[56px] px-4 border-[2px] border-slate09 border-r-[4px] border-b-[5px] rounded-full placeholder:font-normal 
            ${item?.memo?.trim() ? 'bg-lime' : 'bg-violet01 text-black'}`}
          >
            <Image
              src="/svgs/ic-check.svg"
              alt="icon-check"
              width={16}
              height={16}
              priority
            />
            수정 완료
          </button>
          <button
            onClick={handleDelete}
            className="w-[168px] flex-all-center
            h-[56px] px-4 border-[2px] border-slate09 border-r-[4px] border-b-[5px] rounded-full placeholder:font-normal bg-rose text-white"
          >
            <Image
              src="/svgs/ic-X.svg"
              alt="icon-X"
              width={16}
              height={16}
              priority
            />
            삭제하기
          </button>
        </div>
      
    </main>
  );
};

export default ItemDetailPage;
