from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from deepai_nlp.tokenization.crf_tokenizer import CrfTokenizer
from deepai_nlp.word_embedding import word2vec_gensim
from gensim import corpora
from gensim.utils import simple_preprocess
from topic_detection.prepare import preprocess_text
import gensim
import os
import numpy
import pickle
import numpy as np
from django.http import JsonResponse

PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))
print(PROJECT_ROOT)

tokenizer = CrfTokenizer()
num_topic = 35

dictionary = gensim.corpora.Dictionary.load(
    f'{PROJECT_ROOT}/model/dictionary_{num_topic}.gensim')
corpus = pickle.load(open(f'{PROJECT_ROOT}/model/corpus_{num_topic}.pkl', 'rb'))
lda_model = gensim.models.ldamodel.LdaModel.load(
    f'{PROJECT_ROOT}/model/model_{num_topic}.gensim')


@csrf_exempt
def index(request):
    result = dict()
    if request.method == "POST" and request.POST['content']:
        content = request.POST['content']

        if content:
            result['status'] = 'success'
            result['data'] = dict()
            result['data']['topic'] = []
            result['data']['rate'] = []

            test_data = preprocess_text(content, tokenizer)
            for test in test_data:
                bow_vector = dictionary.doc2bow(test)
                for index, score in sorted(lda_model[bow_vector],
                                           key=lambda tup: -1 * tup[1]):
                    result['data']['topic'].append(index)
                    result['data']['rate'].append(score)
            return JsonResponse(str(result), safe=False)

        result['status'] = 'error'
        result['data'] = dict()
        return JsonResponse(str(result), safe=False)
    else:
        return HttpResponse('I Don\'t See You')