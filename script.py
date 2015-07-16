import skipthoughts
import pandas as pd
import numpy as np


model = skipthoughts.load_model()
df = pd.read_csv('/Users/vupham/data/twitter_pmarca/tweets.csv')
tweets = df.text.tolist()

def remove_unicode(ss):
    s2 = []
    for s in ss:
        s = s.split(' ')
        s = [x for x in s if all(ord(c) < 128 for c in x)]
        s = ' '.join(s)
        s2.append(s)
    return s2

tweets = [s for s in tweets if not s.startswith('RT')]
tweets = remove_unicode(tweets)
vectors = skipthoughts.encode(model, tweets)
np.save('vectors.npy', vectors)



import numpy as np
vectors = np.load('vectors.npy').astype(np.float64)

import tsne
vectors_tsne = tsne.tsne(vectors, 3, 50, 30.0)



def to_json(vectors, tweets):
    assert vectors.shape[1] == 3 and vectors.shape[0] == len(tweets)
    d = []
    for i, s in enumerate(tweets):
        d.append({'x': vectors[i, 0], 'y': vectors[i, 1], 'z': vectors[i, 2],
                'tweet': s})
    return d

import json
with open('tweets.js', 'w') as f:
    f.write('var tweets = {};\n'.format(json.dumps(to_json(vectors_tsne, tweets))))


!python bhtsne.py -d 3 -p 30 -v -i ./vectors_nort.tsv -o ./vectors_nort_tsne.tsv


import numpy as np
vectors = np.loadtxt('vectors_nort_tsne.tsv', delimiter='\t')
