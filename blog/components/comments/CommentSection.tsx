"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  onSnapshot,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { User } from "lucide-react";
import { getFirestoreInstance } from "@/lib/firebase";

const COMMENTS_COLLECTION = "comments";
const AUTHOR_MAX = 50;
const BODY_MAX = 2000;

export type CommentItem = {
  id: string;
  path: string;
  author: string;
  body: string;
  createdAt: Timestamp | null;
};

interface CommentSectionProps {
  path: string;
}

export function CommentSection({ path }: CommentSectionProps) {
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const db = getFirestoreInstance();

  useEffect(() => {
    if (!db) {
      setUnavailable(true);
      setReady(true);
      return;
    }
    const q = query(
      collection(db, COMMENTS_COLLECTION),
      where("path", "==", path),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items: CommentItem[] = snap.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            path: (d.path as string) ?? "",
            author: (d.author as string) ?? "",
            body: (d.body as string) ?? "",
            createdAt: (d.createdAt as Timestamp) ?? null,
          };
        });
        setComments(items);
        setReady(true);
      },
      (err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        if (process.env.NODE_ENV === "development") {
          console.error("[CommentSection] Firestore onSnapshot error:", err);
        }
        // 인덱스 미배포 시 에러 메시지에 링크가 포함되는 경우가 많음
        setError(
          message.includes("index") || message.includes("indexes")
            ? "댓글 목록을 불러오지 못했습니다. Firebase 콘솔 또는 터미널에서 'firebase deploy --only firestore:indexes' 실행 후 브라우저 콘솔의 오류 링크를 확인해 주세요."
            : "댓글 목록을 불러오지 못했습니다."
        );
        setReady(true);
      }
    );
    return () => unsub();
  }, [db, path]);

  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const resizeBody = useCallback(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.style.height = "auto";
    const min = 120;
    const max = 320;
    el.style.height = `${Math.min(Math.max(el.scrollHeight, min), max)}px`;
  }, []);

  useEffect(() => {
    resizeBody();
  }, [body, resizeBody]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!db) return;
      const a = author.trim().slice(0, AUTHOR_MAX);
      const b = body.trim().slice(0, BODY_MAX);
      if (!a || !b) {
        setError("별명과 댓글 내용을 입력해 주세요.");
        return;
      }
      setError(null);
      setSubmitting(true);
      try {
        await addDoc(collection(db, COMMENTS_COLLECTION), {
          path,
          author: a,
          body: b,
          createdAt: serverTimestamp(),
        });
        setAuthor("");
        setBody("");
        if (bodyRef.current) {
          bodyRef.current.style.height = "auto";
        }
      } catch {
        setError("댓글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      } finally {
        setSubmitting(false);
      }
    },
    [db, path, author, body]
  );

  const handleCancel = useCallback(() => {
    setBody("");
    setError(null);
    if (bodyRef.current) {
      bodyRef.current.style.height = "auto";
    }
  }, []);

  if (unavailable) {
    return (
      <section
        className="mt-12 pt-10 border-t border-slate-200 dark:border-slate-700"
        aria-label="댓글"
      >
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
          댓글
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          댓글을 사용할 수 없습니다.
        </p>
      </section>
    );
  }

  return (
    <section
      className="mt-12 pt-10 border-t border-slate-200 dark:border-slate-700"
      aria-label="댓글"
    >
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
        댓글 {ready ? `${comments.length}개` : ""}
      </h2>
      <div className="mt-2 mb-6 border-b border-slate-200 dark:border-slate-700" aria-hidden />

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label htmlFor="comment-author" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            별명
          </label>
          <input
            id="comment-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="닉네임을 입력하세요"
            maxLength={AUTHOR_MAX}
            className="w-full max-w-xs min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20"
            disabled={submitting}
          />
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] dark:focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.2)] transition-shadow">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400" aria-hidden>
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <label htmlFor="comment-body" className="sr-only">
                댓글 내용
              </label>
              <textarea
                ref={bodyRef}
                id="comment-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={"댓글을 입력하세요.\n서로 존중하는 댓글 문화를 만들어 주세요."}
                maxLength={BODY_MAX}
                rows={3}
                className="w-full min-h-[80px] resize-none rounded-lg border-0 bg-transparent px-0 py-1 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-0"
                disabled={submitting}
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {body.length}/{BODY_MAX}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="min-h-[44px] w-full rounded-xl border border-slate-300 dark:border-slate-600 px-5 py-2.5 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 sm:w-auto disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="min-h-[44px] w-full rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 px-5 py-2.5 font-semibold text-white shadow-sm hover:from-indigo-600 hover:to-indigo-700 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0 transition-all sm:w-auto"
          >
            {submitting ? "등록 중…" : "댓글 등록"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {!ready && (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            댓글을 불러오는 중…
          </p>
        )}
        {ready && comments.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30 py-10 text-center">
            <p className="text-base font-medium text-slate-600 dark:text-slate-400">
              💬 아직 댓글이 없습니다
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
              가장 먼저 의견을 남겨보세요!
            </p>
          </div>
        )}
        {ready && comments.length > 0 && (
          <ul className="list-none pl-0 space-y-4">
            {comments.map((c) => {
              const date = c.createdAt ? new Date(c.createdAt.toMillis()) : null;
              const initial = (c.author || "?").slice(0, 1).toUpperCase();
              return (
                <li
                  key={c.id}
                  className="flex gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 px-4 py-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-sm font-semibold text-indigo-700 dark:text-indigo-300" aria-hidden>
                    {initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {c.author || "이름 없음"}
                      </span>
                      {date && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDistanceToNow(date, { addSuffix: true, locale: ko })}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-words">
                      {c.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
