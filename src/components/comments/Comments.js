import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useHttp from '../../hooks/use-http';
import { getAllComments } from '../../lib/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import CommentsList from './CommentsList';
import classes from './Comments.module.css';
import NewCommentForm from './NewCommentForm';

const Comments = () => {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const params = useParams();

  const { quoteId } = params;

  const { 
    sendRequest, 
    status, 
    data: loaeddComments 
  } = useHttp(getAllComments);
  
    useEffect(() => {
      sendRequest(quoteId)
    }, [quoteId, sendRequest]);

  const startAddCommentHandler = () => {
    setIsAddingComment(true);
  };

  const addCommentHandler = useCallback(() => {
    sendRequest(quoteId);
  }, [sendRequest, quoteId]);

  let comments;

  if (status === 'pending') {
    comments = (
      <div className='centred'>
        <LoadingSpinner />
      </div>
    );
  }

  if (status === 'completed' && 
    (loaeddComments && loaeddComments.length>0)) 
  {
    comments = <CommentsList comments={loaeddComments} />
  }

  if (status === 'completed' && 
    (!loaeddComments || loaeddComments.length === 0)) 
  {
    comments = <p className='centred'>No comments were added yet!</p>
  }
  
  return (
    <section className={classes.comments}>
      <h2>User Comments</h2>
      {!isAddingComment && (
        <button className='btn' onClick={startAddCommentHandler}>
          Add a Comment
        </button>
      )}
      {isAddingComment &&  (
        <NewCommentForm 
          quoteId={quoteId} 
          onAddedComment={addCommentHandler} 
        />
      )}
      {/* <p>Comments...</p> */}
      {comments}
    </section>
  );
};

export default Comments;
