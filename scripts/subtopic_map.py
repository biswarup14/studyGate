"""Engineering Mathematics subtopic classification.

Maps legacy GATEOverflow tags and 2026 keyword rules onto EM subsections:
Calculus, Linear Algebra, Probability & Statistics, Numerical Methods.
"""

EM_SUBTOPIC_TAG_MAP = [
    # Calculus
    ("calculus", "Calculus"),
    ("limits", "Calculus"),
    ("differentiation", "Calculus"),
    ("integration", "Calculus"),
    ("maxima-minima", "Calculus"),
    ("continuity", "Calculus"),
    ("gradient", "Calculus"),
    ("fourier", "Calculus"),
    ("laplace", "Calculus"),
    ("differential-equations", "Calculus"),
    ("taylor-series", "Calculus"),
    ("maclaurin-series", "Calculus"),
    ("partial-derivatives", "Calculus"),
    ("mean-value-theorem", "Calculus"),
    # Linear Algebra
    ("linear-algebra", "Linear Algebra"),
    ("matrix", "Linear Algebra"),
    ("eigen-value", "Linear Algebra"),
    ("determinant", "Linear Algebra"),
    ("vector-space", "Linear Algebra"),
    ("system-of-equations", "Linear Algebra"),
    ("rank-of-matrix", "Linear Algebra"),
    ("lu-decomposition", "Linear Algebra"),
    ("orthonormality", "Linear Algebra"),
    ("singular-value-decomposition", "Linear Algebra"),
    ("subspace", "Linear Algebra"),
    ("linear-transformation", "Linear Algebra"),
    ("eigenvector", "Linear Algebra"),
    ("diagonalization", "Linear Algebra"),
    # Probability & Statistics
    ("probability", "Probability & Statistics"),
    ("random-variable", "Probability & Statistics"),
    ("expectation", "Probability & Statistics"),
    ("conditional-probability", "Probability & Statistics"),
    ("uniform-distribution", "Probability & Statistics"),
    ("binomial-distribution", "Probability & Statistics"),
    ("poisson-distribution", "Probability & Statistics"),
    ("normal-distribution", "Probability & Statistics"),
    ("exponential-distribution", "Probability & Statistics"),
    ("bernoulli-distribution", "Probability & Statistics"),
    ("probability-distribution", "Probability & Statistics"),
    ("probability-density-function", "Probability & Statistics"),
    ("variance", "Probability & Statistics"),
    ("bayes-theorem", "Probability & Statistics"),
    ("independent-events", "Probability & Statistics"),
    ("statistics", "Probability & Statistics"),
    ("standard-deviation", "Probability & Statistics"),
    # Numerical Methods
    ("numerical-methods", "Numerical Methods"),
    ("numerical-computation", "Numerical Methods"),
    ("newton-raphson", "Numerical Methods"),
    ("bisection", "Numerical Methods"),
    ("trapezoidal-rule", "Numerical Methods"),
    ("simpsons-rule", "Numerical Methods"),
]

# Keyword rules for 2026 official papers (no tags). First match wins.
EM_SUBTOPIC_KEYWORDS = [
    ("Linear Algebra", ["matrix", "eigen", "determinant", "vector space",
     "linear equation", "linear system", "rank of", "lu decomposition",
     "orthonormal", "singular value", "subspace", "linear transformation",
     "trace of", "invertible", "diagonaliz", "eigenvector", "eigen value",
     "linear combination", "span of", "basis of", "inner product",
     "orthogonal projection", "least squares"]),
    ("Calculus", ["limit", "derivative", "differential", "integral",
     "integration", "continu", "maxima", "minima", "gradient", "taylor",
     "laplace", "fourier", "saddle point", "critical point", "stationary",
     "mean value theorem", "rolle", "partial derivative", "curvature",
     "converge", "sequence", "series", "increasing function", "decreasing",
     "concave", "convex", "asymptote", "domain of", "range of"]),
    ("Probability & Statistics", ["probability", "random variable", "density",
     "distribution", "expectation", "variance", "standard deviation",
     "mean", "median", "mode", "poisson", "binomial", "normal",
     "bayes", "conditional", "independent", "covariance", "correlation",
     "mutually exclusive", "sample", "regression", "permutation",
     "combination", "factorial", "randomly", "fair coin", "fair die",
     "outcome"]),
    ("Numerical Methods", ["newton-raphson", "newton raphson", "bisection",
     "numerical integration", "trapezoidal", "simpson", "false position",
     "round-off", "round off", "root of the equation", "iteration method",
     "interpolation", "newton-forward", "gauss-elimination"]),
]


def em_subtopic_from_tags(tags):
    tagset = set(tags)
    for t, sub in EM_SUBTOPIC_TAG_MAP:
        if t in tagset:
            return sub
    return None


def em_subtopic_from_keywords(text):
    low = " " + text.lower() + " "
    for sub, kws in EM_SUBTOPIC_KEYWORDS:
        for kw in kws:
            if kw in low:
                return sub
    return None
